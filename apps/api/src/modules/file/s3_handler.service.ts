import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

import type { StellaConfig } from '@/configs';

@Injectable()
export class S3Handler {
  private bucketS3: string;
  constructor(private readonly configService: ConfigService<StellaConfig>) {
    this.bucketS3 = this.configService.get('file.awsDefaultS3Bucket', {
      infer: true,
    });
  }
  async upload(folder: string, file: any): Promise<any> {
    const { originalname } = file;
    return await this.uploadS3(
      file.buffer,
      this.bucketS3,
      folder,
      originalname,
    );
  }

  async delete(folder: string, name: string): Promise<unknown> {
    return await this.deleteS3(this.bucketS3, folder, name);
  }

  private async uploadS3(
    file: any,
    bucket: string,
    folder: string,
    name: string,
  ): Promise<any> {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: `${folder}/${String(name)}`,
      Body: file,
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.log('S3 eror: ', err);
          reject(err.message);
        }
        return resolve(data);
      });
    });
  }

  private getS3() {
    return new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  private async deleteS3(bucket: string, folder: string, name: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: bucket,
      Key: `${folder}/${String(name)}`,
    };

    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) reject(err);
        else return resolve(data);
      });
    });
  }
}
