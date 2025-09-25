import { Global, Module } from '@nestjs/common';
import { MinIoController } from './min-io.controller';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';
import { MinIoService } from './min-io.service';

@Global()
@Module({
  imports: [
    MinioModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        accessKey: config.getOrThrow('MINIO_ACCESSKEY'),
        secretKey: config.getOrThrow('MINIO_SECRETKEY'),
        port: config.getOrThrow('MINIO_PORT'),
        endPoint: config.getOrThrow('MINIO_ENDPOINT'),
        useSSL: false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MinIoController],
  providers: [MinIoService],
})
export class MinIoModule {}
