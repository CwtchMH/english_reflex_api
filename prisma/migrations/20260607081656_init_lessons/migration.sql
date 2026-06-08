-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LessonLevel" AS ENUM ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "LessonActivityType" AS ENUM ('TRANSCRIPT', 'VOCABULARY', 'MINI_STORY', 'SHADOWING');

-- CreateEnum
CREATE TYPE "LessonProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MiniStoryAnswerStatus" AS ENUM ('RECORDED', 'TRANSCRIBED', 'REVIEWED');

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" "LessonLevel" NOT NULL,
    "durationSec" INTEGER NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranscriptSegment" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "startMs" INTEGER,
    "endMs" INTEGER,

    CONSTRAINT "TranscriptSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VocabularySection" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,

    CONSTRAINT "VocabularySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VocabularyItem" (
    "id" TEXT NOT NULL,
    "vocabularySectionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "phrase" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "example" TEXT NOT NULL,
    "exampleTranslation" TEXT NOT NULL,

    CONSTRAINT "VocabularyItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiniStoryPractice" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "isTextLocked" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MiniStoryPractice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiniStoryCue" (
    "id" TEXT NOT NULL,
    "miniStoryPracticeId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "answerStartMs" INTEGER NOT NULL,
    "questionText" TEXT,
    "questionTranslation" TEXT,
    "expectedAnswer" TEXT,
    "expectedAnswerTranslation" TEXT,

    CONSTRAINT "MiniStoryCue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShadowingItem" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "audioUrl" TEXT,

    CONSTRAINT "ShadowingItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserLessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "lessonVersion" INTEGER NOT NULL,
    "status" "LessonProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "currentActivity" "LessonActivityType",
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMiniStoryAnswer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "cueId" TEXT NOT NULL,
    "lessonVersion" INTEGER NOT NULL,
    "recordingUrl" TEXT NOT NULL,
    "startedAtMs" INTEGER NOT NULL,
    "durationMs" INTEGER,
    "speechToText" TEXT,
    "status" "MiniStoryAnswerStatus" NOT NULL DEFAULT 'RECORDED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMiniStoryAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX "Lesson_status_idx" ON "Lesson"("status");

-- CreateIndex
CREATE INDEX "Lesson_level_idx" ON "Lesson"("level");

-- CreateIndex
CREATE INDEX "TranscriptSegment_lessonId_idx" ON "TranscriptSegment"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "TranscriptSegment_lessonId_orderIndex_key" ON "TranscriptSegment"("lessonId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "VocabularySection_lessonId_key" ON "VocabularySection"("lessonId");

-- CreateIndex
CREATE INDEX "VocabularyItem_vocabularySectionId_idx" ON "VocabularyItem"("vocabularySectionId");

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyItem_vocabularySectionId_orderIndex_key" ON "VocabularyItem"("vocabularySectionId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "MiniStoryPractice_lessonId_key" ON "MiniStoryPractice"("lessonId");

-- CreateIndex
CREATE INDEX "MiniStoryCue_miniStoryPracticeId_idx" ON "MiniStoryCue"("miniStoryPracticeId");

-- CreateIndex
CREATE UNIQUE INDEX "MiniStoryCue_miniStoryPracticeId_orderIndex_key" ON "MiniStoryCue"("miniStoryPracticeId", "orderIndex");

-- CreateIndex
CREATE INDEX "ShadowingItem_lessonId_idx" ON "ShadowingItem"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "ShadowingItem_lessonId_orderIndex_key" ON "ShadowingItem"("lessonId", "orderIndex");

-- CreateIndex
CREATE INDEX "UserLessonProgress_userId_idx" ON "UserLessonProgress"("userId");

-- CreateIndex
CREATE INDEX "UserLessonProgress_lessonId_idx" ON "UserLessonProgress"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLessonProgress_userId_lessonId_key" ON "UserLessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "UserMiniStoryAnswer_userId_lessonId_idx" ON "UserMiniStoryAnswer"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "UserMiniStoryAnswer_cueId_idx" ON "UserMiniStoryAnswer"("cueId");

-- CreateIndex
CREATE INDEX "UserMiniStoryAnswer_lessonId_idx" ON "UserMiniStoryAnswer"("lessonId");

-- AddForeignKey
ALTER TABLE "TranscriptSegment" ADD CONSTRAINT "TranscriptSegment_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularySection" ADD CONSTRAINT "VocabularySection_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyItem" ADD CONSTRAINT "VocabularyItem_vocabularySectionId_fkey" FOREIGN KEY ("vocabularySectionId") REFERENCES "VocabularySection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniStoryPractice" ADD CONSTRAINT "MiniStoryPractice_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniStoryCue" ADD CONSTRAINT "MiniStoryCue_miniStoryPracticeId_fkey" FOREIGN KEY ("miniStoryPracticeId") REFERENCES "MiniStoryPractice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShadowingItem" ADD CONSTRAINT "ShadowingItem_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMiniStoryAnswer" ADD CONSTRAINT "UserMiniStoryAnswer_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMiniStoryAnswer" ADD CONSTRAINT "UserMiniStoryAnswer_cueId_fkey" FOREIGN KEY ("cueId") REFERENCES "MiniStoryCue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
