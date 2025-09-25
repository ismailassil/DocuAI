import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinIoService } from './min-io.service';

@Module({
  imports: [
    ConfigModule,
    MinioModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        accessKey: config.getOrThrow('MINIO_ACCESSKEY'),
        secretKey: config.getOrThrow('MINIO_SECRETKEY'),
        port: parseInt(config.getOrThrow('MINIO_PORT')),
        endPoint: config.getOrThrow('MINIO_ENDPOINT'),
        useSSL: false,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MinIoService],
  exports: [MinIoService],
})
export class MinIoModule {}
