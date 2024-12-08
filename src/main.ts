import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  // Enable CORS
  app.enableCors({
    origin: '*', // Allow requests from any origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Include OPTIONS method
    allowedHeaders: 'Content-Type,Authorization,access_token,refresh_token', // Allow specific headers
    optionsSuccessStatus: 204, // Use HTTP 204 status for preflight success
  });

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  // console.log('PORT IN ENV:', configService.get('PORT'));
}
bootstrap();
