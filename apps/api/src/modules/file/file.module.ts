import { Module } from '@nestjs/common';

import { FileService } from './file.service';
import { S3Handler } from './s3_handler.service';

@Module({
  providers: [FileService, S3Handler],
  exports: [FileService],
})
export class FileModule {}
