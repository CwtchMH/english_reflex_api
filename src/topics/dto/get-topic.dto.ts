import { ApiProperty } from '@nestjs/swagger';
import { TopicResponseDto } from './topic-response.dto.js';

export class GetTopicDto {
  @ApiProperty({
    description: 'Requested learning topic.',
    type: TopicResponseDto,
  })
  topic!: TopicResponseDto;
}
