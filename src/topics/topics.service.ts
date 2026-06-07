import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTopicDto } from './dto/create-topics.dto.js';
import { GetTopicDto } from './dto/get-topic.dto.js';
import { GetTopicsDto } from './dto/get-topics.dto.js';
import { TopicResponseDto } from './dto/topic-response.dto.js';
import { UpdateTopicsDto } from './dto/update-topics.dto.js';

@Injectable()
export class TopicsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopics(): Promise<GetTopicsDto> {
    const topics = await this.prisma.topic.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return {
      topics: topics.map((topic) => this.toTopicResponse(topic)),
    };
  }

  async getTopic(id: string): Promise<GetTopicDto> {
    const topic = await this.findTopicByIdOrThrow(id);

    return { topic };
  }

  async getTopicBySlug(slug: string): Promise<GetTopicDto> {
    const topic = await this.findTopicBySlugOrThrow(slug);

    return { topic };
  }

  async createTopic(dto: CreateTopicDto): Promise<GetTopicDto> {
    const topic = await this.prisma.topic.create({
      data: {
        slug: this.generateSlug(dto.title),
        title: dto.title,
        description: dto.description,
      },
    });

    return { topic: this.toTopicResponse(topic) };
  }

  async updateTopic(id: string, dto: UpdateTopicsDto): Promise<GetTopicDto> {
    await this.findTopicByIdOrThrow(id);

    const topic = await this.prisma.topic.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.title ? { slug: this.generateSlug(dto.title) } : {}),
      },
    });

    return { topic: this.toTopicResponse(topic) };
  }

  async deleteTopic(id: string): Promise<void> {
    await this.findTopicByIdOrThrow(id);

    await this.prisma.topic.delete({
      where: { id },
    });
  }

  private async findTopicByIdOrThrow(id: string): Promise<TopicResponseDto> {
    const topic = await this.prisma.topic.findUnique({
      where: { id },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with id "${id}" was not found.`);
    }

    return this.toTopicResponse(topic);
  }

  private async findTopicBySlugOrThrow(
    slug: string,
  ): Promise<TopicResponseDto> {
    const topic = await this.prisma.topic.findUnique({
      where: { slug },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with slug "${slug}" was not found.`);
    }

    return this.toTopicResponse(topic);
  }

  private toTopicResponse(
    topic: Pick<TopicResponseDto, 'id' | 'slug' | 'title' | 'description'>,
  ): TopicResponseDto {
    return {
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
    };
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}
