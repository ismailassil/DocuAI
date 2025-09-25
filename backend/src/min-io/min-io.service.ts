import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { MinioService, MinioClient } from 'nestjs-minio-client';

@Injectable()
export class MinIoService {
  private readonly bucketName: string;
  private readonly logger: Logger;
  private readonly minioClient: MinioClient;

  constructor(
    private readonly minioService: MinioService,
    private readonly config: ConfigService,
  ) {
    this.bucketName = config.getOrThrow('MINIO_BUCKET');
    this.logger = new Logger('minIO Storage Service');
    this.minioClient = this.minioService.client;
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

      return { filename, ext };
    } catch (error) {
      throw new NotFoundException(
        'Error Occurred during Uploading',
        (error as Error).message,
      );
    }
  }

  async uploadContent(filename: string, content: string) {
    try {
      await this.minioClient.putObject(this.bucketName, filename, content);
    } catch (error) {
      throw new NotFoundException(
        'Error Occurred during Uploading',
        (error as Error).message,
      );
    }
  }

  async getContent(filename: string) {
    try {
      const stream = await this.minioClient.getObject(
        this.bucketName,
        filename,
      );

      let chunks: string = '';
      for await (const chunk of stream) {
        chunks +=
          typeof chunk === 'string'
            ? chunk
            : Buffer.from(chunk).toString('utf-8');
      }

      return Buffer.from(chunks).toString('utf-8');
    } catch (error) {
      throw new NotFoundException(
        'Error Occurred during Uploading',
        (error as Error).message,
      );
    }
  }

  async getBuffer(filename: string) {
    try {
      const stream = await this.minioClient.getObject(
        this.bucketName,
        filename,
      );

      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        if (typeof chunk === 'string') {
          chunks.push(Buffer.from(chunk, 'utf8'));
        } else if (chunk instanceof Buffer) {
          chunks.push(chunk);
        } else {
          throw new Error('Unsupported chunk type');
        }
      }

      return Buffer.concat(chunks);
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
