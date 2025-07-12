import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

import { Multer } from 'multer';

@Injectable()
export class UploadService {
  private s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  async uploadFiles(files: Multer.File[]): Promise<string[]> {
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const urls: string[] = [];

    for (const file of files) {
      const ext = path.extname(file.originalname);
      const key = `${Date.now()}-${uuidv4()}${ext}`;

      await this.s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      urls.push(`https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`);
    }

    return urls;
  }

    async deleteFiles(urls: string[]): Promise<void> {
    const bucket = process.env.AWS_S3_BUCKET_NAME;
      
    const keys = urls.map((url) => this.extractKeyFromUrl(url));
    await this.s3.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: keys.map((Key) => ({ Key })),
          Quiet: true,
        },
      })
    );
  }

  private extractKeyFromUrl(url: string): string {
    const parts = url.split('/');
    return parts.slice(3).join('/');
  }
}
