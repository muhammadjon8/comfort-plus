import { ValidationPipe } from '@nestjs/common';

export const ValidationConfig = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});
