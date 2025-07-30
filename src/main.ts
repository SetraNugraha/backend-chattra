/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 8000);
  console.log(`Server running on port: ${process.env.PORT ?? 8000}`);
}

bootstrap().catch((err) => {
  console.error('Error during app bootstrap: ', err);
});
