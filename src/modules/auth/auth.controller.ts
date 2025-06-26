import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from '../users/dto/user.dto';
import { DateTime } from 'luxon';
import { LoginDto } from './dto/login.dto';
import { GetRefreshToken } from './decorators/cookie-getter.decorator';
import { SetRefreshToken } from './decorators/set-refresh-token';
import { RefreshTokenResponse } from './types/refresh-token-response';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@UseInterceptors(RefreshTokenInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @SetRefreshToken()
  async register(
    @Body() registerDto: RegisterDto
  ): Promise<RefreshTokenResponse<{ accessToken: string; user: UserDto }>> {
    const { accessToken, refreshToken, user } = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'User registered successfully',
      data: { accessToken, user },
      timestamp: DateTime.now().toJSDate(),
      refreshToken,
    };
  }

  @Post('login')
  @SetRefreshToken()
  async login(@Body() loginDto: LoginDto): Promise<RefreshTokenResponse<{ accessToken: string; user: UserDto }>> {
    const { accessToken, refreshToken, user } = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'User logged in successfully',
      data: { accessToken, user },
      timestamp: DateTime.now().toJSDate(),
      refreshToken,
    };
  }

  @Post('refresh-token')
  @SetRefreshToken()
  async refreshToken(@GetRefreshToken() refreshToken: string): Promise<RefreshTokenResponse<{ accessToken: string }>> {
    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshToken(refreshToken);
    return {
      success: true,
      message: 'Token refreshed successfully',
      data: { accessToken },
      timestamp: DateTime.now().toJSDate(),
      refreshToken: newRefreshToken,
    };
  }
}
