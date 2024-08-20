import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FileConfig {
  @IsNotEmpty()
  @IsString()
  driver: string;

  @IsNotEmpty()
  @IsString()
  accessKeyId: string;

  @IsNotEmpty()
  @IsString()
  secretAccessKey: string;

  @IsNotEmpty()
  @IsString()
  awsDefaultS3Bucket: string;

  @IsNotEmpty()
  @IsString()
  awsDefaultS3Url: string;

  @IsNotEmpty()
  @IsString()
  awsS3Region: string;

  @IsNotEmpty()
  @IsNumber()
  maxFileSize: number;

  constructor() {
    this.driver = process.env.FILE_DRIVER ?? 'local';
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    this.awsDefaultS3Bucket = process.env.AWS_BUCKET;
    this.awsDefaultS3Url = process.env.AWS_URL_MEDIA_ENDPOINT;
    this.awsS3Region = process.env.AWS_REGION;
    this.maxFileSize = 5242880; // 5MB
  }
}

export default registerAs<FileConfig>('file', () => new FileConfig());
