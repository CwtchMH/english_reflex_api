import { ApiProperty } from '@nestjs/swagger';
import { LessonLevel } from '../../../generated/prisma/client.js';

export class LessonCardDto {
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

  @ApiProperty({ example: false })
  isCompleted!: boolean;
}

export class PaginatedLessonsDto {
  @ApiProperty({ type: [LessonCardDto] })
  items!: LessonCardDto[];

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 42 })
  total!: number;

  @ApiProperty({ example: 3 })
  totalPages!: number;
}
