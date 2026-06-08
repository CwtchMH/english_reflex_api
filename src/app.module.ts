import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { HealthModule } from './health/health.module.js';
import { TopicsModule } from './topics/topics.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AdminLessonsModule } from './admin-lessons/admin-lessons.module.js';
import { LessonsModule } from './lessons/lessons.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LessonProgressModule } from './lesson-progress/lesson-progress.module.js';

@Module({
  imports: [
    HealthModule,
    TopicsModule,
    PrismaModule,
    AdminLessonsModule,
    LessonsModule,
    AuthModule,
    LessonProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
