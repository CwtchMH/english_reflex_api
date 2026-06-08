import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../generated/prisma/client.js';

export class UserResponseDto {
  @ApiProperty({ example: 'clxyz1234567890abcdef' })
  id!: string;

  @ApiProperty({ example: 'learner@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: 'Hieu', nullable: true })
  displayName!: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role!: UserRole;

  @ApiProperty({ example: '2026-06-07T06:00:00.000Z' })
  createdAt!: Date;
}

export class AuthTokensDto {
  @ApiProperty({ description: 'Short-lived JWT access token.' })
  accessToken!: string;

  @ApiProperty({ description: 'Long-lived opaque refresh token.' })
  refreshToken!: string;
}

export class AuthResultDto extends AuthTokensDto {
  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}
