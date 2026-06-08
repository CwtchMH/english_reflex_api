import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateMiniStoryAnswerDto {
  @ApiProperty({ example: 'clxlesson123' })
  @IsString()
  @IsNotEmpty()
  lessonId!: string;

  @ApiProperty({ example: 'clxcue123' })
  @IsString()
  @IsNotEmpty()
  cueId!: string;

  @ApiProperty({ example: 'https://cdn.example.com/recordings/answer.m4a' })
  @IsString()
  @IsNotEmpty()
  recordingUrl!: string;

  @ApiProperty({ example: 12500, minimum: 0 })
  @IsInt()
  @Min(0)
  startedAtMs!: number;

  @ApiPropertyOptional({ example: 3200, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationMs?: number;
}
