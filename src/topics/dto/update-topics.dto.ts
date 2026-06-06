import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateTopicsDto {
  @ApiPropertyOptional({
    example: 'Basic Greetings',
    description: 'Human-readable topic title.',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    example: 'Practice common greetings and introductions.',
    description: 'Short explanation of what learners practice in this topic.',
    minLength: 10,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description?: string;
}
