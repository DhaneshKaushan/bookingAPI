import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';

import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,

    private jwtService: JwtService,
  ) {}

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

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,

      email: user.email,

      role:user.role
    });


    return {
      access_token: token,
    };
  }
}
