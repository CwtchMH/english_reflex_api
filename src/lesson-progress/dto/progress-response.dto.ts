import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  LessonActivityType,
  LessonProgressStatus,
} from '../../../generated/prisma/client.js';

export class LessonProgressDto {
  @ApiProperty({ example: 'clxlesson123' })
  lessonId!: string;

  @ApiProperty({ example: 1 })
  lessonVersion!: number;

  @ApiProperty({ enum: LessonProgressStatus })
  status!: LessonProgressStatus;

  @ApiPropertyOptional({ enum: LessonActivityType, nullable: true })
  currentActivity!: LessonActivityType | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  completedAt!: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class LessonProgressListDto {
  @ApiProperty({ type: [LessonProgressDto] })
  items!: LessonProgressDto[];
}
