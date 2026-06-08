import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { LessonsService } from './lessons.service.js';
import { ListLessonsQueryDto } from './dto/list-lessons-query.dto.js';
import { PaginatedLessonsDto } from './dto/lesson-card.dto.js';
import { LessonDetailResponseDto } from './dto/public-lesson.dto.js';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly service: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'List published lessons (paginated)' })
  @ApiOkResponse({
    description: 'Published lessons returned.',
    type: PaginatedLessonsDto,
  })
  listLessons(
    @Query() query: ListLessonsQueryDto,
  ): Promise<PaginatedLessonsDto> {
    return this.service.listPublished({
      page: query.page,
      limit: query.limit,
      level: query.level,
    });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a published lesson with its content by slug' })
  @ApiParam({
    name: 'slug',
    example: 'a-simple-morning-routine',
    description: 'Unique lesson slug.',
  })
  @ApiOkResponse({
    description: 'Published lesson returned.',
    type: LessonDetailResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Published lesson was not found.' })
  getLesson(@Param('slug') slug: string): Promise<LessonDetailResponseDto> {
    return this.service.getPublishedBySlug(slug);
  }
}
