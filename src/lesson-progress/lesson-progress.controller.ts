import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { LessonProgressService } from './lesson-progress.service.js';
import { UpdateProgressDto } from './dto/update-progress.dto.js';
import { CreateMiniStoryAnswerDto } from './dto/create-mini-story-answer.dto.js';
import {
  LessonProgressDto,
  LessonProgressListDto,
} from './dto/progress-response.dto.js';
import {
  MiniStoryAnswerDto,
  MiniStoryAnswerListDto,
} from './dto/mini-story-answer-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/jwt.strategy.js';

@ApiTags('me')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token.' })
@UseGuards(JwtAuthGuard)
@Controller('me')
export class LessonProgressController {
  constructor(private readonly service: LessonProgressService) {}

  @Get('lesson-progress')
  @ApiOperation({ summary: 'List the current user lesson progress' })
  @ApiOkResponse({ type: LessonProgressListDto })
  listProgress(@CurrentUser() user: AuthUser): Promise<LessonProgressListDto> {
    return this.service.listProgress(user.userId);
  }

  @Put('lesson-progress/:lessonId')
  @ApiOperation({ summary: 'Upsert progress for a lesson' })
  @ApiOkResponse({ type: LessonProgressDto })
  @ApiNotFoundResponse({ description: 'Lesson not found.' })
  upsertProgress(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateProgressDto,
  ): Promise<LessonProgressDto> {
    return this.service.upsertProgress(user.userId, lessonId, dto);
  }

  @Post('mini-story-answers')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Record a mini-story answer' })
  @ApiCreatedResponse({ type: MiniStoryAnswerDto })
  @ApiNotFoundResponse({ description: 'Lesson not found.' })
  @ApiUnprocessableEntityResponse({
    description: 'Cue does not belong to this lesson.',
  })
  createAnswer(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateMiniStoryAnswerDto,
  ): Promise<MiniStoryAnswerDto> {
    return this.service.createAnswer(user.userId, dto);
  }

  @Get('lessons/:lessonId/mini-story-answers')
  @ApiOperation({
    summary: 'List the current user mini-story answers for a lesson',
  })
  @ApiOkResponse({ type: MiniStoryAnswerListDto })
  @ApiNotFoundResponse({ description: 'Lesson not found.' })
  listAnswers(
    @CurrentUser() user: AuthUser,
    @Param('lessonId') lessonId: string,
  ): Promise<MiniStoryAnswerListDto> {
    return this.service.listAnswers(user.userId, lessonId);
  }
}
