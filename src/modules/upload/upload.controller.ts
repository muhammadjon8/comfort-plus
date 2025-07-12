import { Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './aws-s3.service';
import { Multer } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images')
  @UseInterceptors(FilesInterceptor('files'))
  async upload(@UploadedFiles() files: Multer.File[]) {
    const urls = await this.uploadService.uploadFiles(files);
    return { success: true, urls };
  }
}
