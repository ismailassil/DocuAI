import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'DocuAI',
    }),
  });
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
