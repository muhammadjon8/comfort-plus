import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthTokensService } from './auth-token.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule, UsersModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthService, AuthTokensService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
