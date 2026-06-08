import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { LessonLevel } from '../../../generated/prisma/client.js';

export class UpdateLessonDto {
  @ApiPropertyOptional({
    example: 'A Simple Morning Routine',
    minLength: 2,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ enum: LessonLevel, example: LessonLevel.BEGINNER })
  @IsOptional()
  @IsEnum(LessonLevel)
  level?: LessonLevel;

  @ApiPropertyOptional({ example: 480, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationSec?: number;
}
