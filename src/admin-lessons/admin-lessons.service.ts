import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { generateSlug } from '../common/slug.util.js';
import {
  LessonStatus,
  type LessonLevel,
  type Prisma,
} from '../../generated/prisma/client.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { LessonContentDto } from './dto/lesson-content.dto.js';
import { LessonSummaryDto } from './dto/lesson-response.dto.js';
import {
  validateLessonForPublish,
  type PublishableLesson,
} from './lesson-publish.validator.js';

const lessonDetailInclude = {
  transcriptSegments: { orderBy: { orderIndex: 'asc' } },
  vocabularySection: { include: { items: { orderBy: { orderIndex: 'asc' } } } },
  miniStoryPractice: { include: { cues: { orderBy: { orderIndex: 'asc' } } } },
  shadowingItems: { orderBy: { orderIndex: 'asc' } },
} satisfies Prisma.LessonInclude;

type LessonDetail = Prisma.LessonGetPayload<{
  include: typeof lessonDetailInclude;
}>;

@Injectable()
export class AdminLessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async listLessons(
    status?: LessonStatus,
  ): Promise<{ items: LessonSummaryDto[] }> {
    const lessons = await this.prisma.lesson.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return { items: lessons.map((lesson) => this.toSummary(lesson)) };
  }

  async getLesson(id: string): Promise<LessonDetail> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: lessonDetailInclude,
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" was not found.`);
    }
    return lesson;
  }

  async createLesson(dto: CreateLessonDto): Promise<LessonSummaryDto> {
    const slug = await this.generateUniqueSlug(dto.title);
    const lesson = await this.prisma.lesson.create({
      data: {
        slug,
        title: dto.title,
        level: dto.level,
        durationSec: dto.durationSec,
      },
    });
    return this.toSummary(lesson);
  }

  async updateMetadata(
    id: string,
    dto: UpdateLessonDto,
  ): Promise<LessonSummaryDto> {
    await this.ensureExists(id);
    const lesson = await this.prisma.lesson.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.level !== undefined ? { level: dto.level } : {}),
        ...(dto.durationSec !== undefined
          ? { durationSec: dto.durationSec }
          : {}),
      },
    });
    return this.toSummary(lesson);
  }

  async replaceContent(id: string, dto: LessonContentDto): Promise<void> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      select: { id: true, status: true },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" was not found.`);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.transcriptSegment.deleteMany({ where: { lessonId: id } });
      await tx.shadowingItem.deleteMany({ where: { lessonId: id } });
      await tx.vocabularySection.deleteMany({ where: { lessonId: id } });
      await tx.miniStoryPractice.deleteMany({ where: { lessonId: id } });

      if (dto.transcript.length > 0) {
        await tx.transcriptSegment.createMany({
          data: dto.transcript.map((segment) => ({
            lessonId: id,
            orderIndex: segment.orderIndex,
            text: segment.text,
            translation: segment.translation,
            startMs: segment.startMs ?? null,
            endMs: segment.endMs ?? null,
          })),
        });
      }

      if (dto.shadowing.length > 0) {
        await tx.shadowingItem.createMany({
          data: dto.shadowing.map((item) => ({
            lessonId: id,
            orderIndex: item.orderIndex,
            text: item.text,
            translation: item.translation,
            audioUrl: item.audioUrl ?? null,
          })),
        });
      }

      await tx.vocabularySection.create({
        data: {
          lessonId: id,
          audioUrl: dto.vocabulary.audioUrl,
          items: {
            create: dto.vocabulary.items.map((item) => ({
              orderIndex: item.orderIndex,
              phrase: item.phrase,
              meaning: item.meaning,
              explanation: item.explanation,
              example: item.example,
              exampleTranslation: item.exampleTranslation,
            })),
          },
        },
      });

      await tx.miniStoryPractice.create({
        data: {
          lessonId: id,
          audioUrl: dto.miniStoryPractice.audioUrl,
          isTextLocked: dto.miniStoryPractice.isTextLocked,
          cues: {
            create: dto.miniStoryPractice.cues.map((cue) => ({
              orderIndex: cue.orderIndex,
              answerStartMs: cue.answerStartMs,
              questionText: cue.questionText ?? null,
              questionTranslation: cue.questionTranslation ?? null,
              expectedAnswer: cue.expectedAnswer ?? null,
              expectedAnswerTranslation: cue.expectedAnswerTranslation ?? null,
            })),
          },
        },
      });

      if (lesson.status === LessonStatus.PUBLISHED) {
        await tx.lesson.update({
          where: { id },
          data: { version: { increment: 1 } },
        });
      }
    });
  }

  async publishLesson(id: string): Promise<LessonSummaryDto> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: lessonDetailInclude,
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" was not found.`);
    }

    const errors = validateLessonForPublish(this.toPublishable(lesson));
    if (errors.length > 0) {
      throw new UnprocessableEntityException({
        message: 'Lesson is not ready to publish',
        errors,
      });
    }

    const updated = await this.prisma.lesson.update({
      where: { id },
      data: {
        status: LessonStatus.PUBLISHED,
        publishedAt: lesson.publishedAt ?? new Date(),
      },
    });
    return this.toSummary(updated);
  }

  async archiveLesson(id: string): Promise<LessonSummaryDto> {
    await this.ensureExists(id);
    const updated = await this.prisma.lesson.update({
      where: { id },
      data: { status: LessonStatus.ARCHIVED },
    });
    return this.toSummary(updated);
  }

  private async ensureExists(id: string): Promise<void> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!lesson) {
      throw new NotFoundException(`Lesson with id "${id}" was not found.`);
    }
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = generateSlug(title);
    let slug = base;
    let attempt = 1;
    while (
      await this.prisma.lesson.findUnique({
        where: { slug },
        select: { id: true },
      })
    ) {
      attempt += 1;
      slug = `${base}-${attempt}`;
    }
    return slug;
  }

  private toSummary(lesson: {
    id: string;
    slug: string;
    title: string;
    level: LessonLevel;
    durationSec: number;
    status: LessonStatus;
    version: number;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): LessonSummaryDto {
    return {
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      level: lesson.level,
      durationSec: lesson.durationSec,
      status: lesson.status,
      version: lesson.version,
      publishedAt: lesson.publishedAt,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }

  private toPublishable(lesson: LessonDetail): PublishableLesson {
    return {
      slug: lesson.slug,
      title: lesson.title,
      level: lesson.level,
      durationSec: lesson.durationSec,
      transcriptSegments: lesson.transcriptSegments.map((segment) => ({
        orderIndex: segment.orderIndex,
        text: segment.text,
        translation: segment.translation,
        startMs: segment.startMs,
        endMs: segment.endMs,
      })),
      vocabularySection: lesson.vocabularySection
        ? {
            audioUrl: lesson.vocabularySection.audioUrl,
            items: lesson.vocabularySection.items.map((item) => ({
              orderIndex: item.orderIndex,
              phrase: item.phrase,
              meaning: item.meaning,
              explanation: item.explanation,
              example: item.example,
              exampleTranslation: item.exampleTranslation,
            })),
          }
        : null,
      miniStoryPractice: lesson.miniStoryPractice
        ? {
            audioUrl: lesson.miniStoryPractice.audioUrl,
            isTextLocked: lesson.miniStoryPractice.isTextLocked,
            cues: lesson.miniStoryPractice.cues.map((cue) => ({
              orderIndex: cue.orderIndex,
              answerStartMs: cue.answerStartMs,
            })),
          }
        : null,
      shadowingItems: lesson.shadowingItems.map((item) => ({
        orderIndex: item.orderIndex,
        text: item.text,
        translation: item.translation,
      })),
    };
  }
}
