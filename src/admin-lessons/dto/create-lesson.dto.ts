import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { LessonLevel } from '../../../generated/prisma/client.js';

export class CreateLessonDto {
  @ApiProperty({
    example: 'A Simple Morning Routine',
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  title!: string;

  @ApiProperty({ enum: LessonLevel, example: LessonLevel.BEGINNER })
  @IsEnum(LessonLevel)
  level!: LessonLevel;

  @ApiProperty({
    example: 480,
    minimum: 1,
    description: 'Lesson length in seconds.',
  })
  @IsInt()
  @Min(1)
  durationSec!: number;
}
