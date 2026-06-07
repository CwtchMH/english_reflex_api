import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTopicDto } from './dto/create-topics.dto.js';
import { GetTopicDto } from './dto/get-topic.dto.js';
import { GetTopicsDto } from './dto/get-topics.dto.js';
import { UpdateTopicsDto } from './dto/update-topics.dto.js';
import { TopicsService } from './topics.service.js';

@ApiTags('topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  @ApiOperation({ summary: 'Get available learning topics' })
  @ApiOkResponse({
    description: 'Available learning topics returned successfully.',
    type: GetTopicsDto,
  })
  getTopics(): Promise<GetTopicsDto> {
    return this.topicsService.getTopics();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a learning topic by slug' })
  @ApiParam({
    name: 'slug',
    example: 'basic-greetings',
    description: 'Unique topic slug.',
  })
  @ApiOkResponse({
    description: 'Learning topic returned successfully.',
    type: GetTopicDto,
  })
  @ApiNotFoundResponse({ description: 'Topic was not found.' })
  getTopicBySlug(@Param('slug') slug: string): Promise<GetTopicDto> {
    return this.topicsService.getTopicBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a learning topic by id' })
  @ApiParam({
    name: 'id',
    example: 'clxyz1234567890abcdef',
    description: 'Unique topic identifier.',
  })
  @ApiOkResponse({
    description: 'Learning topic returned successfully.',
    type: GetTopicDto,
  })
  @ApiNotFoundResponse({ description: 'Topic was not found.' })
  getTopic(@Param('id') id: string): Promise<GetTopicDto> {
    return this.topicsService.getTopic(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a learning topic' })
  @ApiCreatedResponse({
    description: 'Learning topic created successfully.',
    type: GetTopicDto,
  })
  createTopic(@Body() dto: CreateTopicDto): Promise<GetTopicDto> {
    return this.topicsService.createTopic(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a learning topic' })
  @ApiParam({
    name: 'id',
    example: 'clxyz1234567890abcdef',
    description: 'Unique topic identifier.',
  })
  @ApiOkResponse({
    description: 'Learning topic updated successfully.',
    type: GetTopicDto,
  })
  @ApiNotFoundResponse({ description: 'Topic was not found.' })
  updateTopic(
    @Param('id') id: string,
    @Body() dto: UpdateTopicsDto,
  ): Promise<GetTopicDto> {
    return this.topicsService.updateTopic(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a learning topic' })
  @ApiParam({
    name: 'id',
    example: 'clxyz1234567890abcdef',
    description: 'Unique topic identifier.',
  })
  @ApiNoContentResponse({ description: 'Learning topic deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Topic was not found.' })
  deleteTopic(@Param('id') id: string): Promise<void> {
    return this.topicsService.deleteTopic(id);
  }
}
