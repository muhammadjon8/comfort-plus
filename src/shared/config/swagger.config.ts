import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Comfort Plus')
  .setDescription('The Comfort Plus API description')
  .setVersion('1.0')
  .build();
