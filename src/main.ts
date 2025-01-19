import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ErrorHandlerExceptionFilter } from './filters/error-handler-exception.filter';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    // To use nestjs-i18n in your DTO validation
    new I18nValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),

    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new ErrorHandlerExceptionFilter());
  // enable DI for class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(1812);
}
bootstrap();
