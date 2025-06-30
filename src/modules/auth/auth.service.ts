import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthTokensService } from './auth-token.service';
import { RegisterDto } from './dto/register.dto';
import { Hasher } from '../../shared/libs/hasher.lib';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './types';
import { LoginDto } from './dto/login.dto';
import { UserDto } from '../users/dto/user.dto';
import { Request, Response } from 'express';
import { Role } from '../../shared/types/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly authTokensService: AuthTokensService,
    private readonly usersService: UsersService
  ) {}

  async register(registerDto: RegisterDto) {
    const newUser = await this.usersService.createUser({ ...registerDto });
    const payload: JwtPayload = { id: newUser.id, userEmail: newUser.email, role: Role.USER };
    const [accessToken, refreshToken] = await Promise.all([
      this.authTokensService.generateAccessToken(payload),
      this.authTokensService.generateRefreshToken(payload),
    ]);
    return { accessToken, user: newUser, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findUserByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await Hasher.verifyHash(user.password, dto.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const payload: JwtPayload = { id: user.id, userEmail: user.email, role: Role[user.role as keyof typeof Role] };
    const [accessToken, refreshToken] = await Promise.all([
      this.authTokensService.generateAccessToken(payload),
      this.authTokensService.generateRefreshToken(payload),
    ]);
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      } as UserDto,
    };
  }
  async refreshToken(token: string) {
    const payload = await this.authTokensService.verifyRefreshToken(token);
    if (!payload) {
      throw new BadRequestException('Invalid token');
    }
    const user = await this.usersService.findUserByEmail(payload.userEmail);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const newPayload: JwtPayload = { id: user.id, userEmail: user.email, role: Role[user.role as keyof typeof Role] };
    const [accessToken, refreshToken] = await Promise.all([
      this.authTokensService.generateAccessToken(newPayload),
      this.authTokensService.generateRefreshToken(newPayload),
    ]);
    return { accessToken, refreshToken };
  }
}
