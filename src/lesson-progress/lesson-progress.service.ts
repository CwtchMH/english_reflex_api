import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  LessonProgressStatus,
  type UserLessonProgress,
  type UserMiniStoryAnswer,
} from '../../generated/prisma/client.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';
import { CreateMiniStoryAnswerDto } from './dto/create-mini-story-answer.dto.js';
import {
  LessonProgressDto,
  LessonProgressListDto,
} from './dto/progress-response.dto.js';
import {
  MiniStoryAnswerDto,
  MiniStoryAnswerListDto,
} from './dto/mini-story-answer-response.dto.js';

@Injectable()
export class LessonProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async listProgress(userId: string): Promise<LessonProgressListDto> {
    const rows = await this.prisma.userLessonProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return { items: rows.map((row) => this.toProgressDto(row)) };
  }

  async upsertProgress(
    userId: string,
    lessonId: string,
    dto: UpdateProgressDto,
  ): Promise<LessonProgressDto> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const existing = await this.prisma.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
    const completedAt =
      dto.status === LessonProgressStatus.COMPLETED
        ? (existing?.completedAt ?? new Date())
        : null;

    const row = await this.prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        lessonVersion: lesson.version,
        status: dto.status,
        currentActivity: dto.currentActivity ?? null,
        completedAt,
      },
      update: {
        lessonVersion: lesson.version,
        status: dto.status,
        currentActivity: dto.currentActivity ?? null,
        completedAt,
      },
    });
    return this.toProgressDto(row);
  }

  async createAnswer(
    userId: string,
    dto: CreateMiniStoryAnswerDto,
  ): Promise<MiniStoryAnswerDto> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: dto.lessonId },
      include: { miniStoryPractice: true },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const cue = await this.prisma.miniStoryCue.findUnique({
      where: { id: dto.cueId },
    });
    if (
      !cue ||
      !lesson.miniStoryPractice ||
      cue.miniStoryPracticeId !== lesson.miniStoryPractice.id
    ) {
      throw new UnprocessableEntityException(
        'Cue does not belong to this lesson',
      );
    }

    const row = await this.prisma.userMiniStoryAnswer.create({
      data: {
        userId,
        lessonId: dto.lessonId,
        cueId: dto.cueId,
        lessonVersion: lesson.version,
        recordingUrl: dto.recordingUrl,
        startedAtMs: dto.startedAtMs,
        durationMs: dto.durationMs ?? null,
      },
    });
    return this.toAnswerDto(row);
  }

  async listAnswers(
    userId: string,
    lessonId: string,
  ): Promise<MiniStoryAnswerListDto> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const rows = await this.prisma.userMiniStoryAnswer.findMany({
      where: { userId, lessonId },
      orderBy: [{ cue: { orderIndex: 'asc' } }, { createdAt: 'asc' }],
    });
    return { items: rows.map((row) => this.toAnswerDto(row)) };
  }

  private toProgressDto(row: UserLessonProgress): LessonProgressDto {
    return {
      lessonId: row.lessonId,
      lessonVersion: row.lessonVersion,
      status: row.status,
      currentActivity: row.currentActivity,
      completedAt: row.completedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private toAnswerDto(row: UserMiniStoryAnswer): MiniStoryAnswerDto {
    return {
      id: row.id,
      lessonId: row.lessonId,
      cueId: row.cueId,
      lessonVersion: row.lessonVersion,
      recordingUrl: row.recordingUrl,
      startedAtMs: row.startedAtMs,
      durationMs: row.durationMs,
      speechToText: row.speechToText,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
