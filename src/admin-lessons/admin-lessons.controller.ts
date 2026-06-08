import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AdminLessonsService } from './admin-lessons.service.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { LessonContentDto } from './dto/lesson-content.dto.js';
import { ListLessonsQueryDto } from './dto/list-lessons-query.dto.js';
import {
  LessonListDto,
  LessonSummaryDto,
  PublishErrorDto,
} from './dto/lesson-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ADMIN_ROLE, Roles } from '../auth/decorators/roles.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(ADMIN_ROLE)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@ApiForbiddenResponse({ description: 'Requires the ADMIN role.' })
@ApiTags('admin-lessons')
@Controller('admin/lessons')
export class AdminLessonsController {
  constructor(private readonly service: AdminLessonsService) {}

  @Get()
  @ApiOperation({ summary: 'List lessons (any status), optionally filtered' })
  @ApiOkResponse({ description: 'Lessons returned.', type: LessonListDto })
  listLessons(@Query() query: ListLessonsQueryDto): Promise<LessonListDto> {
    return this.service.listLessons(query.status);
  }

  @Post()
  @ApiOperation({ summary: 'Create a draft lesson' })
  @ApiOkResponse({
    description: 'Draft lesson created.',
    type: LessonSummaryDto,
  })
  createLesson(@Body() dto: CreateLessonDto): Promise<LessonSummaryDto> {
    return this.service.createLesson(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lesson with its full content' })
  @ApiParam({ name: 'id', description: 'Lesson id.' })
  @ApiOkResponse({ description: 'Lesson with nested content returned.' })
  @ApiNotFoundResponse({ description: 'Lesson was not found.' })
  getLesson(@Param('id') id: string) {
    return this.service.getLesson(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lesson metadata' })
  @ApiParam({ name: 'id', description: 'Lesson id.' })
  @ApiOkResponse({
    description: 'Lesson metadata updated.',
    type: LessonSummaryDto,
  })
  @ApiNotFoundResponse({ description: 'Lesson was not found.' })
  updateLesson(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
  ): Promise<LessonSummaryDto> {
    return this.service.updateMetadata(id, dto);
  }

  @Put(':id/content')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Replace all lesson content' })
  @ApiParam({ name: 'id', description: 'Lesson id.' })
  @ApiNoContentResponse({ description: 'Lesson content replaced.' })
  @ApiNotFoundResponse({ description: 'Lesson was not found.' })
  replaceContent(
    @Param('id') id: string,
    @Body() dto: LessonContentDto,
  ): Promise<void> {
    return this.service.replaceContent(id, dto);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Validate and publish a lesson' })
  @ApiParam({ name: 'id', description: 'Lesson id.' })
  @ApiOkResponse({ description: 'Lesson published.', type: LessonSummaryDto })
  @ApiNotFoundResponse({ description: 'Lesson was not found.' })
  @ApiUnprocessableEntityResponse({
    description: 'Lesson failed publish validation.',
    type: PublishErrorDto,
  })
  publishLesson(@Param('id') id: string): Promise<LessonSummaryDto> {
    return this.service.publishLesson(id);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive a lesson' })
  @ApiParam({ name: 'id', description: 'Lesson id.' })
  @ApiOkResponse({ description: 'Lesson archived.', type: LessonSummaryDto })
  @ApiNotFoundResponse({ description: 'Lesson was not found.' })
  archiveLesson(@Param('id') id: string): Promise<LessonSummaryDto> {
    return this.service.archiveLesson(id);
  }
}
