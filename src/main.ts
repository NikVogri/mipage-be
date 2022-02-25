import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log(process.env.URL_ORIGIN);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: process.env.URL_ORIGIN,
  });
  app.use(cookieParser());
  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
