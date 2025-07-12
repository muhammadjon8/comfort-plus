import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvConfig } from './shared/config/env.config';
import { DatabaseModule } from './modules/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { UploadModule } from './modules/upload/upload.module';
import { FarmerModule } from './modules/farmer/farmer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnvConfig,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    UploadModule,
    FarmerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
