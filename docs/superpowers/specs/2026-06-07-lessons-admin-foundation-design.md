# Lessons Backend — Plan 1: Foundation + Admin

Date: 2026-06-07

## Status

Approved design. This is the first of three plans derived from the approved
lessons schema design (`2026-06-07-lessons-backend-schema-design.md`).

## Scope and Decomposition

The full lessons backend is split into three sequential plans by subsystem and
dependency:

1. **Plan 1 — Foundation + Admin** (this document): Prisma schema + migration,
   `AdminLessonsModule` (create/update content/publish/archive + publish
   validation). Built first because publish validation is the riskiest logic and
   admin endpoints produce the real data needed to test later plans.
2. **Plan 2 — Public read** (`LessonsModule`): `GET /lessons`,
   `GET /lessons/:slug`, mapping to the Flutter `LessonContent` shape. Depends on
   having `PUBLISHED` lessons from Plan 1.
3. **Plan 3 — User progress** (`LessonProgressModule`): progress + mini-story
   answers. Depends on the auth/`userId` decision.

This document covers Plan 1 only.

## Settled Decisions

- **Topic relation:** `Lesson` stays independent. No `topicId` / `Topic`
  relation at this stage (matches the original schema spec).
- **Architecture pattern:** Service calls Prisma directly, consistent with the
  existing `topics` module. No separate repository layer.
- **Content write strategy:** Full replace inside a single transaction (delete
  existing children, recreate from payload). Matches `PUT` semantics.
- **Admin auth:** Endpoints are open for now (no guard). Auth is deferred to a
  later effort. This is the fastest path to producing data.
- **Slug:** Auto-generated from `title` on create (same approach as `topics`),
  guaranteed unique. Slug is stable after creation — `PATCH` does not change it,
  to keep public URLs durable.

## A. Schema + Migration

- Add all enums and models from the approved schema spec to
  `prisma/schema.prisma`, keeping the existing `Topic` model untouched:
  `LessonStatus`, `LessonLevel`, `LessonActivityType`, `LessonProgressStatus`,
  `MiniStoryAnswerStatus`, and models `Lesson`, `TranscriptSegment`,
  `VocabularySection`, `VocabularyItem`, `MiniStoryPractice`, `MiniStoryCue`,
  `ShadowingItem`, `UserLessonProgress`, `UserMiniStoryAnswer`.
- The `UserLessonProgress` and `UserMiniStoryAnswer` models are added to the
  schema now (one atomic migration for the whole cluster) but their APIs belong
  to Plan 3.
- Create one Prisma migration for the whole lessons cluster.
- Normalize the minor column-alignment quirks from the source spec block (e.g.
  `miniStoryPracticeId`, `expectedAnswerTranslation`) when writing the real
  schema — cosmetic only.

## B. Module + Endpoints (`AdminLessonsModule`)

Thin controller → service coordinates use cases → Prisma. Register the module in
`AppModule`.

```text
GET   /admin/lessons            # list all statuses, optional ?status= filter
POST  /admin/lessons            # create DRAFT (metadata only)
GET   /admin/lessons/:id        # full detail incl. content
PATCH /admin/lessons/:id        # update metadata (title, level, durationSec)
PUT   /admin/lessons/:id/content# full replace of nested content
POST  /admin/lessons/:id/publish# validate then publish
POST  /admin/lessons/:id/archive# set ARCHIVED
```

- `POST /admin/lessons` accepts `title`, `level`, `durationSec`. `slug` is
  auto-generated from `title` and made unique. Lesson starts as `DRAFT`,
  `version = 1`.
- `PATCH /admin/lessons/:id` updates `title`, `level`, `durationSec`. Does not
  change `slug`.
- `GET /admin/lessons/:id` returns the lesson with all nested content
  (transcript, vocabulary + items, mini-story + cues, shadowing).

## C. Publish Validation

A pure `LessonPublishValidator` (no Prisma dependency, easy to unit test) that
takes a fully-loaded lesson and returns a list of validation errors. Rules
(from the approved spec):

- Non-empty `slug`, `title`, valid `level`, `durationSec > 0`.
- At least one transcript segment.
- Transcript `orderIndex` values unique and ordered.
- Transcript timing valid when present: `startMs >= 0`, `endMs > startMs`.
- One vocabulary section with non-empty `audioUrl` and at least one item.
- One mini-story practice with non-empty `audioUrl`, `isTextLocked = true`, and
  at least one cue.
- Mini-story cue `answerStartMs` non-negative and strictly increasing by
  `orderIndex`.
- At least one shadowing item.
- Required public text fields non-empty after trimming.

If validation fails, `POST /:id/publish` rejects with HTTP `422` and a
structured body listing missing/invalid fields. On success: set
`status = PUBLISHED` and set `publishedAt = now()` when publishing for the first
time.

## D. Content Write + Version Semantics

- `PUT /admin/lessons/:id/content`: in one transaction, delete existing
  children and recreate from the payload.
- Version: if the lesson is currently `PUBLISHED` and content changes, increment
  `version`. While `DRAFT`, do not increment.
- Cascade note: a full replace deletes `MiniStoryCue` rows, which cascades to
  `UserMiniStoryAnswer`. No user answers exist in Plan 1 scope (no progress
  module yet), so full replace is safe now. **Plan 3 must revisit this** to
  avoid destroying user recordings when editing a published lesson (e.g.
  restrict content edits on published lessons, or stable cue identifiers).

## E. Error Handling + Testing

- Input validation with `class-validator` DTOs plus Swagger decorators, matching
  the `topics` module conventions (ESM `.js` imports, `@ApiTags`, response DTOs).
- `404` when a lesson id is not found; `422` when publish validation fails.
- Unit tests: `LessonPublishValidator` (each rule, pass and fail) and service
  methods (create, content replace, version bump, publish, archive).
- e2e test: create → put content → publish happy path, plus a publish-rejection
  case.

## Out of Scope (Plan 1)

- Public read APIs (Plan 2).
- User progress and mini-story answer APIs (Plan 3).
- Authentication / authorization (deferred).
- `Topic` ↔ `Lesson` relationship.
- `isCompleted` computation on lesson cards (Plan 2; note it requires user
  context, which conflicts with unauthenticated public reads — to resolve in
  Plan 2).
