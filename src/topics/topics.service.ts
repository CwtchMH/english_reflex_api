import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicsDto } from './dto/create-topics.dto';
import { GetTopicDto } from './dto/get-topic.dto';
import { GetTopicsDto } from './dto/get-topics.dto';
import { TopicResponseDto } from './dto/topic-response.dto';
import { UpdateTopicsDto } from './dto/update-topics.dto';

@Injectable()
export class TopicsService {
  private nextTopicId = 4;

  private topics: TopicResponseDto[] = [
    {
      id: 1,
      title: 'Basic Greetings',
      description: 'Practice common greetings and introductions.',
    },
    {
      id: 2,
      title: 'Daily Conversations',
      description: 'Build reflexes for everyday English conversations.',
    },
    {
      id: 3,
      title: 'Travel English',
      description: 'Practice useful phrases for trips, hotels, and airports.',
    },
  ];

  getTopics(): GetTopicsDto {
    return {
      topics: this.topics,
    };
  }

  getTopic(id: number): GetTopicDto {
    return {
      topic: this.findTopicByIdOrThrow(id),
    };
  }

  createTopic(dto: CreateTopicsDto): GetTopicDto {
    const topic: TopicResponseDto = {
      id: this.nextTopicId++,
      title: dto.title,
      description: dto.description,
    };

    this.topics.push(topic);

    return {
      topic,
    };
  }

  updateTopic(id: number, dto: UpdateTopicsDto): GetTopicDto {
    const topicIndex = this.findTopicIndexByIdOrThrow(id);
    const currentTopic = this.topics[topicIndex];

    const updatedTopic: TopicResponseDto = {
      ...currentTopic,
      ...dto,
    };

    this.topics[topicIndex] = updatedTopic;

    return {
      topic: updatedTopic,
    };
  }

  deleteTopic(id: number): void {
    const topicIndex = this.findTopicIndexByIdOrThrow(id);

    this.topics.splice(topicIndex, 1);
  }

  private findTopicByIdOrThrow(id: number): TopicResponseDto {
    const topic = this.topics.find((item) => item.id === id);

    if (!topic) {
      throw new NotFoundException(`Topic with id "${id}" was not found.`);
    }

    return topic;
  }

  private findTopicIndexByIdOrThrow(id: number): number {
    const topicIndex = this.topics.findIndex((item) => item.id === id);

    if (topicIndex === -1) {
      throw new NotFoundException(`Topic with id "${id}" was not found.`);
    }

    return topicIndex;
  }
}
