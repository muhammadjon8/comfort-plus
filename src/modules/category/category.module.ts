// category.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module'; // adjust path accordingly
import { DatabaseModule } from '../database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({}),
    AuthModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

