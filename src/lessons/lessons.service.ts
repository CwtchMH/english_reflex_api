import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  LessonStatus,
  type LessonLevel,
  type Prisma,
} from '../../generated/prisma/client.js';
import { PaginatedLessonsDto } from './dto/lesson-card.dto.js';
import { LessonDetailResponseDto } from './dto/public-lesson.dto.js';

const publicContentInclude = {
  transcriptSegments: { orderBy: { orderIndex: 'asc' } },
  vocabularySection: { include: { items: { orderBy: { orderIndex: 'asc' } } } },
  miniStoryPractice: { include: { cues: { orderBy: { orderIndex: 'asc' } } } },
  shadowingItems: { orderBy: { orderIndex: 'asc' } },
} satisfies Prisma.LessonInclude;

type PublicLessonDetail = Prisma.LessonGetPayload<{
  include: typeof publicContentInclude;
}>;

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublished(params: {
    page: number;
    limit: number;
    level?: LessonLevel;
  }): Promise<PaginatedLessonsDto> {
    const { page, limit, level } = params;
    const where: Prisma.LessonWhereInput = {
      status: LessonStatus.PUBLISHED,
      ...(level ? { level } : {}),
    };

    const [lessons, total] = await this.prisma.$transaction([
      this.prisma.lesson.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      items: lessons.map((lesson) => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        level: lesson.level,
        durationSec: lesson.durationSec,
        isCompleted: false,
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPublishedBySlug(slug: string): Promise<LessonDetailResponseDto> {
    const lesson = await this.prisma.lesson.findFirst({
      where: { slug, status: LessonStatus.PUBLISHED },
      include: publicContentInclude,
    });
    if (!lesson) {
      throw new NotFoundException(
        `Published lesson with slug "${slug}" was not found.`,
      );
    }
    return this.toDetail(lesson);
  }

  private toDetail(lesson: PublicLessonDetail): LessonDetailResponseDto {
    return {
      lesson: {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        level: lesson.level,
        durationSec: lesson.durationSec,
        version: lesson.version,
      },
      content: {
        transcript: lesson.transcriptSegments.map((segment) => ({
          orderIndex: segment.orderIndex,
          text: segment.text,
          translation: segment.translation,
          startMs: segment.startMs,
          endMs: segment.endMs,
        })),
        vocabulary: lesson.vocabularySection
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
                questionText: cue.questionText,
                questionTranslation: cue.questionTranslation,
                expectedAnswer: cue.expectedAnswer,
                expectedAnswerTranslation: cue.expectedAnswerTranslation,
              })),
            }
          : null,
        shadowing: lesson.shadowingItems.map((item) => ({
          orderIndex: item.orderIndex,
          text: item.text,
          translation: item.translation,
          audioUrl: item.audioUrl,
        })),
      },
    };
  }
}
