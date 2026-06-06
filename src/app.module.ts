import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [HealthModule, TopicsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
