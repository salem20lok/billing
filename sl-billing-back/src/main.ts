import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NODE_ENV } from './@types/env.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  if (configService.get('NODE_ENV') === NODE_ENV.DEVELOPMENT) {
    app.enableCors();
  } else {
    app.enableCors({
      origin: configService.get('CORS_ENABLED_ORIGINS'),
      methods: configService.get('CORS_ENABLED_METHODS'),
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
  }
  await app.listen(configService.get('PORT') || 3000);
}

bootstrap();
