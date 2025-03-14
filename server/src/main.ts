import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Enable all logs
  });
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors();
  await app.listen(<number>configService.get('PORT'), '0.0.0.0');
  Logger.log('🚀 Server is running on http://localhost:3010', 'Bootstrap');
}
bootstrap();
