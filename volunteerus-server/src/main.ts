import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as csurf from 'csurf';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for all origins
  // app.use(csurf()); // Enable CSRF protection for all routes
  await app.listen(5000);
}
bootstrap();