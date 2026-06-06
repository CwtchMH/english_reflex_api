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
  ParseIntPipe,
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
import { CreateTopicsDto } from './dto/create-topics.dto';
import { GetTopicDto } from './dto/get-topic.dto';
import { GetTopicsDto } from './dto/get-topics.dto';
import { UpdateTopicsDto } from './dto/update-topics.dto';
import { TopicsService } from './topics.service';

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
  getTopics(): GetTopicsDto {
    return this.topicsService.getTopics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a learning topic by id' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Unique topic identifier.',
  })
  @ApiOkResponse({
    description: 'Learning topic returned successfully.',
    type: GetTopicDto,
  })
  @ApiNotFoundResponse({ description: 'Topic was not found.' })
  getTopic(@Param('id', ParseIntPipe) id: number): GetTopicDto {
    return this.topicsService.getTopic(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a learning topic' })
  @ApiCreatedResponse({
    description: 'Learning topic created successfully.',
    type: GetTopicDto,
  })
  createTopic(@Body() dto: CreateTopicsDto): GetTopicDto {
    return this.topicsService.createTopic(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a learning topic' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Unique topic identifier.',
  })
  @ApiOkResponse({
    description: 'Learning topic updated successfully.',
    type: GetTopicDto,
  })
  @ApiNotFoundResponse({ description: 'Topic was not found.' })
  updateTopic(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTopicsDto,
  ): GetTopicDto {
    return this.topicsService.updateTopic(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a learning topic' })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'Unique topic identifier.',
  })
  @ApiNoContentResponse({ description: 'Learning topic deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Topic was not found.' })
  deleteTopic(@Param('id', ParseIntPipe) id: number): void {
    this.topicsService.deleteTopic(id);
  }
}
