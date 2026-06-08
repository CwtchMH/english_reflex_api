export interface PublishableTranscriptSegment {
  orderIndex: number;
  text: string;
  translation: string;
  startMs: number | null;
  endMs: number | null;
}

export interface PublishableVocabularyItem {
  orderIndex: number;
  phrase: string;
  meaning: string;
  explanation: string;
  example: string;
  exampleTranslation: string;
}

export interface PublishableVocabularySection {
  audioUrl: string;
  items: PublishableVocabularyItem[];
}

export interface PublishableMiniStoryCue {
  orderIndex: number;
  answerStartMs: number;
}

export interface PublishableMiniStoryPractice {
  audioUrl: string;
  isTextLocked: boolean;
  cues: PublishableMiniStoryCue[];
}

export interface PublishableShadowingItem {
  orderIndex: number;
  text: string;
  translation: string;
}

export interface PublishableLesson {
  slug: string;
  title: string;
  level: string | null;
  durationSec: number;
  transcriptSegments: PublishableTranscriptSegment[];
  vocabularySection: PublishableVocabularySection | null;
  miniStoryPractice: PublishableMiniStoryPractice | null;
  shadowingItems: PublishableShadowingItem[];
}

function isBlank(value: string | null | undefined): boolean {
  return value == null || value.trim().length === 0;
}

export function validateLessonForPublish(lesson: PublishableLesson): string[] {
  const errors: string[] = [];

  if (isBlank(lesson.slug)) errors.push('slug must not be empty');
  if (isBlank(lesson.title)) errors.push('title must not be empty');
  if (isBlank(lesson.level)) errors.push('level must be set');
  if (!(lesson.durationSec > 0)) {
    errors.push('durationSec must be greater than 0');
  }

  validateTranscript(lesson.transcriptSegments, errors);
  validateVocabulary(lesson.vocabularySection, errors);
  validateMiniStory(lesson.miniStoryPractice, errors);

  if (lesson.shadowingItems.length === 0) {
    errors.push('lesson must have at least one shadowing item');
  }

  return errors;
}

function validateTranscript(
  segments: PublishableTranscriptSegment[],
  errors: string[],
): void {
  if (segments.length === 0) {
    errors.push('lesson must have at least one transcript segment');
    return;
  }

  const orders = segments.map((segment) => segment.orderIndex);
  if (new Set(orders).size !== orders.length) {
    errors.push('transcript orderIndex values must be unique');
  }

  segments.forEach((segment, index) => {
    if (isBlank(segment.text)) {
      errors.push(`transcript segment ${index} text must not be empty`);
    }
    if (isBlank(segment.translation)) {
      errors.push(`transcript segment ${index} translation must not be empty`);
    }

    const hasTiming = segment.startMs != null || segment.endMs != null;
    if (hasTiming) {
      if ((segment.startMs ?? -1) < 0) {
        errors.push(`transcript segment ${index} startMs must be >= 0`);
      }
      if (
        segment.startMs == null ||
        segment.endMs == null ||
        segment.endMs <= segment.startMs
      ) {
        errors.push(
          `transcript segment ${index} endMs must be greater than startMs`,
        );
      }
    }
  });
}

function validateVocabulary(
  section: PublishableVocabularySection | null,
  errors: string[],
): void {
  if (section == null) {
    errors.push('lesson must have a vocabulary section');
    return;
  }
  if (isBlank(section.audioUrl)) {
    errors.push('vocabulary section audioUrl must not be empty');
  }
  if (section.items.length === 0) {
    errors.push('vocabulary section must have at least one item');
  }
}

function validateMiniStory(
  practice: PublishableMiniStoryPractice | null,
  errors: string[],
): void {
  if (practice == null) {
    errors.push('lesson must have a mini-story practice');
    return;
  }
  if (isBlank(practice.audioUrl)) {
    errors.push('mini-story practice audioUrl must not be empty');
  }
  if (practice.isTextLocked !== true) {
    errors.push('mini-story practice isTextLocked must be true');
  }
  if (practice.cues.length === 0) {
    errors.push('mini-story practice must have at least one cue');
    return;
  }

  const cues = [...practice.cues].sort((a, b) => a.orderIndex - b.orderIndex);
  let previous = -1;
  const increasing = cues.every((cue) => {
    const ok = cue.answerStartMs >= 0 && cue.answerStartMs > previous;
    previous = cue.answerStartMs;
    return ok;
  });
  if (!increasing) {
    errors.push(
      'mini-story cue answerStartMs must be non-negative and strictly increasing by orderIndex',
    );
  }
}
