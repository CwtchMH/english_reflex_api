import { Module } from '@nestjs/common';
import { TopicsController } from './topics.controller.js';
import { TopicsService } from './topics.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  controllers: [TopicsController],
  providers: [TopicsService],
  imports: [PrismaModule],
})
export class TopicsModule {}
