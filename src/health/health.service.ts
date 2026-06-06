import { Injectable } from '@nestjs/common';
import type { HealthResponse } from './interfaces/health-response.interface';

@Injectable()
export class HealthService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
