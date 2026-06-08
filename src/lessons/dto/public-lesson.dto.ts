import { ApiProperty } from '@nestjs/swagger';
import { LessonLevel } from '../../../generated/prisma/client.js';

export class PublicLessonDto {
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

  @ApiProperty({ example: 1 })
  version!: number;
}

export class PublicTranscriptSegmentDto {
  @ApiProperty({ example: 0 })
  orderIndex!: number;

  @ApiProperty({ example: 'Good morning.' })
  text!: string;

  @ApiProperty({ example: 'Chào buổi sáng.' })
  translation!: string;

  @ApiProperty({ example: 0, nullable: true })
  startMs!: number | null;

  @ApiProperty({ example: 1500, nullable: true })
  endMs!: number | null;
}

export class PublicVocabularyItemDto {
  @ApiProperty({ example: 0 })
  orderIndex!: number;

  @ApiProperty({ example: 'wake up' })
  phrase!: string;

  @ApiProperty({ example: 'thức dậy' })
  meaning!: string;

  @ApiProperty({ example: 'to stop sleeping' })
  explanation!: string;

  @ApiProperty({ example: 'I wake up at 7.' })
  example!: string;

  @ApiProperty({ example: 'Tôi thức dậy lúc 7 giờ.' })
  exampleTranslation!: string;
}

export class PublicVocabularySectionDto {
  @ApiProperty({ example: 'https://cdn.example.com/vocab.mp3' })
  audioUrl!: string;

  @ApiProperty({ type: [PublicVocabularyItemDto] })
  items!: PublicVocabularyItemDto[];
}

export class PublicMiniStoryCueDto {
  @ApiProperty({ example: 0 })
  orderIndex!: number;

  @ApiProperty({ example: 1000 })
  answerStartMs!: number;

  @ApiProperty({ example: 'What time do you wake up?', nullable: true })
  questionText!: string | null;

  @ApiProperty({ example: 'Bạn thức dậy lúc mấy giờ?', nullable: true })
  questionTranslation!: string | null;

  @ApiProperty({ example: 'I wake up at seven.', nullable: true })
  expectedAnswer!: string | null;

  @ApiProperty({ example: 'Tôi thức dậy lúc bảy giờ.', nullable: true })
  expectedAnswerTranslation!: string | null;
}

export class PublicMiniStoryPracticeDto {
  @ApiProperty({ example: 'https://cdn.example.com/mini.mp3' })
  audioUrl!: string;

  @ApiProperty({ example: true })
  isTextLocked!: boolean;

  @ApiProperty({ type: [PublicMiniStoryCueDto] })
  cues!: PublicMiniStoryCueDto[];
}

export class PublicShadowingItemDto {
  @ApiProperty({ example: 0 })
  orderIndex!: number;

  @ApiProperty({ example: 'Repeat after me.' })
  text!: string;

  @ApiProperty({ example: 'Nhắc lại theo tôi.' })
  translation!: string;

  @ApiProperty({
    example: 'https://cdn.example.com/shadow-1.mp3',
    nullable: true,
  })
  audioUrl!: string | null;
}

export class PublicLessonContentDto {
  @ApiProperty({ type: [PublicTranscriptSegmentDto] })
  transcript!: PublicTranscriptSegmentDto[];

  @ApiProperty({ type: PublicVocabularySectionDto, nullable: true })
  vocabulary!: PublicVocabularySectionDto | null;

  @ApiProperty({ type: PublicMiniStoryPracticeDto, nullable: true })
  miniStoryPractice!: PublicMiniStoryPracticeDto | null;

  @ApiProperty({ type: [PublicShadowingItemDto] })
  shadowing!: PublicShadowingItemDto[];
}

export class LessonDetailResponseDto {
  @ApiProperty({ type: PublicLessonDto })
  lesson!: PublicLessonDto;

  @ApiProperty({ type: PublicLessonContentDto })
  content!: PublicLessonContentDto;
}
