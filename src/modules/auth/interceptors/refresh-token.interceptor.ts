// auth/interceptors/refresh-token.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';
import { SET_REFRESH_TOKEN } from '../decorators/set-refresh-token';

@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const shouldSetRefreshToken = this.reflector.get<boolean>(SET_REFRESH_TOKEN, context.getHandler());

    if (!shouldSetRefreshToken) {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap((data) => {
        if (data?.refreshToken) {
          response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          delete data.refreshToken;
        }
      })
    );
  }
}
