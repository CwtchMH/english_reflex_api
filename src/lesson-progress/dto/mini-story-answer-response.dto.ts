import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MiniStoryAnswerStatus } from '../../../generated/prisma/client.js';

export class MiniStoryAnswerDto {
  @ApiProperty({ example: 'clxanswer123' })
  id!: string;

  @ApiProperty({ example: 'clxlesson123' })
  lessonId!: string;

  @ApiProperty({ example: 'clxcue123' })
  cueId!: string;

  @ApiProperty({ example: 1 })
  lessonVersion!: number;

  @ApiProperty({ example: 'https://cdn.example.com/recordings/answer.m4a' })
  recordingUrl!: string;

  @ApiProperty({ example: 12500 })
  startedAtMs!: number;

  @ApiPropertyOptional({ example: 3200, nullable: true })
  durationMs!: number | null;

  @ApiPropertyOptional({ nullable: true })
  speechToText!: string | null;

  @ApiProperty({ enum: MiniStoryAnswerStatus })
  status!: MiniStoryAnswerStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class MiniStoryAnswerListDto {
  @ApiProperty({ type: [MiniStoryAnswerDto] })
  items!: MiniStoryAnswerDto[];
}
