import { NestFactory }
from '@nestjs/core';

import {
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://your-domain.com',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );



  await app.listen(process.env.PORT || 5000, '0.0.0.0');

  console.log(
    `🚀 Server running on port ${process.env.PORT || 5000}`,
  );
}

bootstrap(); // ✅ ONLY ONCE


