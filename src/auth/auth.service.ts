import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';

import { UserRole } from '../users/entities/user.entity';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,

    private jwtService: JwtService,

    private configService: ConfigService,
  ) {}

  private generateAccessToken(payload: any) {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),

      expiresIn: '7d',
    });
  }

  // register API
  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      name: dto.name,

      email: dto.email,

      password: hashedPassword,

      role: UserRole.CUSTOMER,
    });

    return {
      message: 'User registered successfully',

      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  // login API
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,

      email: user.email,

      role: user.role,
    };

    // Access token

    const accessToken = this.generateAccessToken(payload);

    // Refresh token

    const refreshToken = this.generateRefreshToken(payload);

    // Hash refresh token

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // Replace old refresh token hash

    user.refreshTokenHash = refreshTokenHash;

    await this.usersService.save(user);

    return {
      accessToken,

      refreshToken,
    };
  }

  // refresh API
  async refresh(refreshToken: string) {
    let payload: any;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);

    if (!isMatch) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
    };
  }

  // Logout API
  async logout(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.refreshTokenHash = null;

    await this.usersService.save(user);

    return {
      message: 'Logout successful',
    };
  }
}
