import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    enum: ['ok'],
    example: 'ok',
    description: 'Application health status.',
  })
  status!: 'ok';

  @ApiProperty({
    example: 123.45,
    description: 'Application uptime in seconds.',
  })
  uptime!: number;

  @ApiProperty({
    example: '2026-06-06T10:00:00.000Z',
    description: 'Time when the health response was generated.',
  })
  timestamp!: string;
}
