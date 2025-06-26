import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';

const Cookiegetter = createParamDecorator((data: string, context: ExecutionContext): string => {
  const request = context.switchToHttp().getRequest();
  const refresh_token = request.cookies[data];
  if (!refresh_token) {
    throw new UnauthorizedException('Token is not found');
  }
  return refresh_token;
});

export const GetRefreshToken = () => Cookiegetter('refreshToken');
