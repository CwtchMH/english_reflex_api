import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AdminLessonsController } from './admin-lessons.controller.js';
import { AdminLessonsService } from './admin-lessons.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [AdminLessonsController],
  providers: [AdminLessonsService],
})
export class AdminLessonsModule {}
