import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import type { MinioClient } from 'nestjs-minio-client';

@Injectable()
export class MinIoService {
  private readonly bucketName: string;
  private readonly logger: Logger;

  constructor(
    @Inject('MINIO_CONNECTION') private readonly minioClient: MinioClient,
    private readonly config: ConfigService,
  ) {
    this.bucketName = config.getOrThrow('MINIO_BUCKET');
    this.logger = new Logger('minIO Storage Service');
  }

  async uploadFile(file: Express.Multer.File) {
    const hashed_filename = createHash('md5')
      .update(Date.now().toString())
      .digest('hex');
    const name = file.originalname;
    const ext = name.substring(name.lastIndexOf('.'), name.length);
    const filename = hashed_filename + ext;

    try {
      await this.minioClient.putObject(this.bucketName, filename, file.buffer);
    } catch (error) {
      throw new NotFoundException(
        'Error Occurred during Uploading',
        (error as Error).message,
      );
    }
  }

  async getFile(filename: string) {
    try {
      return await this.minioClient.getObject(this.bucketName, filename);
    } catch (error) {
      throw new NotFoundException(
        'Error Occurred during Fetching',
        (error as Error).message,
      );
    }
  }

  async deleteFile(filename: string) {
    try {
      await this.minioClient.removeObject(this.bucketName, filename, {
        forceDelete: true,
      });
    } catch (error) {
      throw new HttpException(
        'Error Occurred during Deleting' + (error as Error).message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
