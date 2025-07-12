import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ConfigModule } from '@nestjs/config';
import { UploadService } from './aws-s3.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UploadController],
    providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
