import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { LessonProgressController } from './lesson-progress.controller.js';
import { LessonProgressService } from './lesson-progress.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [LessonProgressController],
  providers: [LessonProgressService],
})
export class LessonProgressModule {}
