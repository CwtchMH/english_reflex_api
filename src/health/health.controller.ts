import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './dto/health-response.dto';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check application health' })
  @ApiOkResponse({
    description: 'Application is running.',
    type: HealthResponseDto,
  })
  getHealth(): HealthResponseDto {
    return this.healthService.getHealth();
  }
}
