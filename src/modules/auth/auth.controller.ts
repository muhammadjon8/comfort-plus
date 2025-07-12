import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from '../users/dto/user.dto';
import { DateTime } from 'luxon';
import { LoginDto } from './dto/login.dto';
import { GetRefreshToken } from './decorators/cookie-getter.decorator';
import { SetRefreshToken } from './decorators/set-refresh-token';
import { RefreshTokenResponse } from './types/refresh-token-response';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(RefreshTokenInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @SetRefreshToken()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiBody({ type: RegisterDto })
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
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiBody({ type: LoginDto })
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
  @ApiCookieAuth() // To let Swagger know you're using cookies
  @ApiOperation({ summary: 'Refresh access token using refresh token from cookies' })
  @ApiResponse({ status: 200, description: 'Access token refreshed successfully' })
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
