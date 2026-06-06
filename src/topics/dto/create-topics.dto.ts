import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTopicsDto {
  @ApiProperty({
    example: 'Basic Greetings',
    description: 'Human-readable topic title.',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  title!: string;

  @ApiProperty({
    example: 'Practice common greetings and introductions.',
    description: 'Short explanation of what learners practice in this topic.',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(500)
  description!: string;
}
