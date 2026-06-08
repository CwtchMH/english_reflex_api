import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { LessonStatus } from '../../../generated/prisma/client.js';

export class ListLessonsQueryDto {
  @ApiPropertyOptional({ enum: LessonStatus, example: LessonStatus.DRAFT })
  @IsOptional()
  @IsEnum(LessonStatus)
  status?: LessonStatus;
}
