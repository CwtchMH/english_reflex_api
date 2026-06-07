import { ApiProperty } from '@nestjs/swagger';

export class TopicResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique topic identifier.',
  })
  id!: string;

  @ApiProperty({
    example: 'basic-greetings',
    description: 'Unique topic slug.',
  })
  slug!: string;

  @ApiProperty({
    example: 'Basic Greetings',
    description: 'Human-readable topic title.',
  })
  title!: string;

  @ApiProperty({
    example: 'Practice common greetings and introductions.',
    description: 'Short explanation of what learners practice in this topic.',
  })
  description!: string;
}
