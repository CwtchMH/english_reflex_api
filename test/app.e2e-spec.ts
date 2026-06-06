import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import type { HealthResponseDto } from './../src/health/dto/health-response.dto';
import { setupSwagger } from './../src/config/swagger.config';

interface OpenApiPathItem {
  get?: unknown;
}

interface OpenApiDocument {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: Record<string, OpenApiPathItem>;
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const configureSwagger = setupSwagger as (
      application: INestApplication<App>,
    ) => void;
    configureSwagger(app);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((response) => {
        const body = response.body as unknown as HealthResponseDto;

        expect(body.status).toBe('ok');
        expect(typeof body.uptime).toBe('number');
        expect(body.uptime).toBeGreaterThanOrEqual(0);
        expect(typeof body.timestamp).toBe('string');
        expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
      });
  });

  it('/docs-json (GET)', () => {
    return request(app.getHttpServer())
      .get('/docs-json')
      .expect(200)
      .expect((response) => {
        const body = response.body as unknown as OpenApiDocument;

        expect(body.openapi).toMatch(/^3\./);
        expect(body.info.title).toBe('English Reflex API');
        expect(body.info.version).toBe('1.0');
        expect(body.paths['/health']?.get).toBeDefined();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
