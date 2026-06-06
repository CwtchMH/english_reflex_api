import { ApiProperty } from '@nestjs/swagger';
import { TopicResponseDto } from './topic-response.dto';

export class GetTopicsDto {
  @ApiProperty({
    description: 'Available learning topics.',
    type: [TopicResponseDto],
  })
  topics!: TopicResponseDto[];
}
