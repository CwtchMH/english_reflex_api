import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LessonLevel, LessonStatus } from '../../../generated/prisma/client.js';

export class LessonSummaryDto {
  @ApiProperty({ example: 'clxyz1234567890abcdef' })
  id!: string;

  @ApiProperty({ example: 'a-simple-morning-routine' })
  slug!: string;

  @ApiProperty({ example: 'A Simple Morning Routine' })
  title!: string;

  @ApiProperty({ enum: LessonLevel, example: LessonLevel.BEGINNER })
  level!: LessonLevel;

  @ApiProperty({ example: 480 })
  durationSec!: number;

  @ApiProperty({ enum: LessonStatus, example: LessonStatus.DRAFT })
  status!: LessonStatus;

  @ApiProperty({ example: 1 })
  version!: number;

  @ApiPropertyOptional({ example: '2026-06-07T07:00:00.000Z', nullable: true })
  publishedAt!: Date | null;

  @ApiProperty({ example: '2026-06-07T06:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-06-07T06:30:00.000Z' })
  updatedAt!: Date;
}

export class LessonListDto {
  @ApiProperty({ type: [LessonSummaryDto] })
  items!: LessonSummaryDto[];
}

export class PublishErrorDto {
  @ApiProperty({ example: 422 })
  statusCode!: number;

  @ApiProperty({ example: 'Lesson is not ready to publish' })
  message!: string;

  @ApiProperty({
    example: ['lesson must have at least one transcript segment'],
    type: [String],
  })
  errors!: string[];
}
