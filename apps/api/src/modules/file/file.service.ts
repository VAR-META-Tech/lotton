import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import type { StellaConfig } from '@/configs';

@Injectable()
export class FileService {
  private s3: S3;
  constructor(private readonly configService: ConfigService<StellaConfig>) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('file.accessKeyId', { infer: true }),
      secretAccessKey: this.configService.get('file.secretAccessKey', {
        infer: true,
      }),
    });
  }

  async uploadS3(file: Express.Multer.File, key: string): Promise<string> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'File does not exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const uploadResult = await this.s3
      .upload({
        Bucket: process.env.AWS_BUCKET,
        Key: `${key}/` + uuidv4(),
        Body: file.buffer,
      })
      .promise();

    if (!uploadResult || !uploadResult.Location)
      throw new BadRequestException('Upload failed');

    return uploadResult.Location;
  }

  async deleteS3(link: string): Promise<void> {
    const url = new URL(link);
    const key = url.pathname.substring(1);

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }
}
