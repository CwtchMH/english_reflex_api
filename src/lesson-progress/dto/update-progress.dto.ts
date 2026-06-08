import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import {
  LessonActivityType,
  LessonProgressStatus,
} from '../../../generated/prisma/client.js';

export class UpdateProgressDto {
  @ApiProperty({ enum: LessonProgressStatus })
  @IsEnum(LessonProgressStatus)
  status!: LessonProgressStatus;

  @ApiPropertyOptional({ enum: LessonActivityType })
  @IsOptional()
  @IsEnum(LessonActivityType)
  currentActivity?: LessonActivityType;
}
