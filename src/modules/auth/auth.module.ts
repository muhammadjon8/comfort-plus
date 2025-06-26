import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthTokensService } from './auth-token.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule, UsersModule],
  providers: [AuthService, AuthTokensService],
  controllers: [AuthController],
})
export class AuthModule {}
