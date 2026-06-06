import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SWAGGER_PATH = 'docs';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('English Reflex API')
    .setDescription('API documentation for English Reflex')
    .setVersion('1.0')
    .addTag('health', 'Application health checks')
    .addTag('topics', 'Learning topic catalog')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_PATH, app, documentFactory);
}
