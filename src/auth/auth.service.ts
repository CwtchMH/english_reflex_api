import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { type User } from '../../generated/prisma/client.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import {
  AuthResultDto,
  AuthTokensDto,
  UserResponseDto,
} from './dto/auth-response.dto.js';

const ACCESS_TTL = process.env.JWT_ACCESS_TTL ?? '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_TTL ?? '30d';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResultDto> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email, passwordHash, displayName: dto.displayName ?? null },
    });
    return this.buildResult(user);
  }

  async login(dto: LoginDto): Promise<AuthResultDto> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const matches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildResult(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokensDto> {
    const record = await this.findValidRefreshToken(refreshToken);
    if (!record) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: record.userId },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.issueTokens(user);
  }

  async logout(refreshToken: string): Promise<void> {
    const record = await this.findValidRefreshToken(refreshToken);
    if (record) {
      await this.prisma.refreshToken.update({
        where: { id: record.id },
        data: { revokedAt: new Date() },
      });
    }
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.toUserResponse(user);
  }

  private async buildResult(user: User): Promise<AuthResultDto> {
    const tokens = await this.issueTokens(user);
    return { user: this.toUserResponse(user), ...tokens };
  }

  private async issueTokens(user: User): Promise<AuthTokensDto> {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role },
      {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: ACCESS_TTL as JwtSignOptions['expiresIn'],
      },
    );
    const refreshToken = randomBytes(48).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: new Date(Date.now() + this.refreshTtlMs()),
      },
    });
    return { accessToken, refreshToken };
  }

  private async findValidRefreshToken(token: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hashToken(token) },
    });
    if (
      !record ||
      record.revokedAt !== null ||
      record.expiresAt <= new Date()
    ) {
      return null;
    }
    return record;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private refreshTtlMs(): number {
    const match = /^(\d+)([smhd])$/.exec(REFRESH_TTL.trim());
    if (!match) {
      const asNumber = Number(REFRESH_TTL);
      return Number.isFinite(asNumber)
        ? asNumber
        : 30 * 24 * 60 * 60 * 1000;
    }
    const value = Number(match[1]);
    const unitMs: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return value * unitMs[match[2]];
  }

  private toUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
