import { ApiProperty } from '@nestjs/swagger';

export class TopicResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Unique topic identifier.',
  })
  id!: number;

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
