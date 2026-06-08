import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TranscriptSegmentInputDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  orderIndex!: number;

  @ApiProperty({ example: 'Good morning.' })
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty({ example: 'Chào buổi sáng.' })
  @IsString()
  @IsNotEmpty()
  translation!: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  startMs?: number;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @IsInt()
  @Min(0)
  endMs?: number;
}

export class VocabularyItemInputDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  orderIndex!: number;

  @ApiProperty({ example: 'wake up' })
  @IsString()
  @IsNotEmpty()
  phrase!: string;

  @ApiProperty({ example: 'thức dậy' })
  @IsString()
  @IsNotEmpty()
  meaning!: string;

  @ApiProperty({ example: 'to stop sleeping' })
  @IsString()
  @IsNotEmpty()
  explanation!: string;

  @ApiProperty({ example: 'I wake up at 7.' })
  @IsString()
  @IsNotEmpty()
  example!: string;

  @ApiProperty({ example: 'Tôi thức dậy lúc 7 giờ.' })
  @IsString()
  @IsNotEmpty()
  exampleTranslation!: string;
}

export class VocabularySectionInputDto {
  @ApiProperty({ example: 'https://cdn.example.com/lesson-001/vocabulary.mp3' })
  @IsString()
  @IsNotEmpty()
  audioUrl!: string;

  @ApiProperty({ type: [VocabularyItemInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VocabularyItemInputDto)
  items!: VocabularyItemInputDto[];
}

export class MiniStoryCueInputDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  orderIndex!: number;

  @ApiProperty({ example: 1000 })
  @IsInt()
  @Min(0)
  answerStartMs!: number;

  @ApiPropertyOptional({ example: 'What time do you wake up?' })
  @IsOptional()
  @IsString()
  questionText?: string;

  @ApiPropertyOptional({ example: 'Bạn thức dậy lúc mấy giờ?' })
  @IsOptional()
  @IsString()
  questionTranslation?: string;

  @ApiPropertyOptional({ example: 'I wake up at seven.' })
  @IsOptional()
  @IsString()
  expectedAnswer?: string;

  @ApiPropertyOptional({ example: 'Tôi thức dậy lúc bảy giờ.' })
  @IsOptional()
  @IsString()
  expectedAnswerTranslation?: string;
}

export class MiniStoryPracticeInputDto {
  @ApiProperty({
    example: 'https://cdn.example.com/lesson-001/mini-story-full.mp3',
  })
  @IsString()
  @IsNotEmpty()
  audioUrl!: string;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  isTextLocked!: boolean;

  @ApiProperty({ type: [MiniStoryCueInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MiniStoryCueInputDto)
  cues!: MiniStoryCueInputDto[];
}

export class ShadowingItemInputDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  orderIndex!: number;

  @ApiProperty({ example: 'Repeat after me.' })
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiProperty({ example: 'Nhắc lại theo tôi.' })
  @IsString()
  @IsNotEmpty()
  translation!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/lesson-001/shadow-1.mp3',
  })
  @IsOptional()
  @IsString()
  audioUrl?: string;
}

export class LessonContentDto {
  @ApiProperty({ type: [TranscriptSegmentInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranscriptSegmentInputDto)
  transcript!: TranscriptSegmentInputDto[];

  @ApiProperty({ type: VocabularySectionInputDto })
  @ValidateNested()
  @Type(() => VocabularySectionInputDto)
  vocabulary!: VocabularySectionInputDto;

  @ApiProperty({ type: MiniStoryPracticeInputDto })
  @ValidateNested()
  @Type(() => MiniStoryPracticeInputDto)
  miniStoryPractice!: MiniStoryPracticeInputDto;

  @ApiProperty({ type: [ShadowingItemInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShadowingItemInputDto)
  shadowing!: ShadowingItemInputDto[];
}
