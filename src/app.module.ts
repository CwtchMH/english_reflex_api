import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { TopicsModule } from './topics/topics.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [HealthModule, TopicsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
