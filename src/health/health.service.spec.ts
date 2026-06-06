import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    healthService = module.get<HealthService>(HealthService);
  });

  it('should return the application health status', () => {
    const result = healthService.getHealth();

    expect(result.status).toBe('ok');
    expect(typeof result.uptime).toBe('number');
    expect(result.uptime).toBeGreaterThanOrEqual(0);
    expect(typeof result.timestamp).toBe('string');
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});
