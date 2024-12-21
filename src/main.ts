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
  );

  app.useGlobalFilters(
    new ErrorHandlerExceptionFilter(),
    // To translate the class-validator errors
    new I18nValidationExceptionFilter({
      detailedErrors: false,
      responseBodyFormatter(host, exc, formattedErrors) {
        const formatError = (error) => {
          if (
            !error.constraints ||
            Object.keys(error.constraints).length === 0
          ) {
            if (error.children && error.children.length > 0) {
              return error.children.flatMap((child) => formatError(child));
            }
            return []; // No constraints and no children, return empty
          }
          return Object.values(error.constraints);
        };

        return {
          status: HttpStatus.BAD_REQUEST,
          message: exc.errors.map((error) => ({
            property: error.property,
            message: formatError(error),
          })),
        };
      },
    }),
  );
  // enable DI for class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.listen(1812);
}
bootstrap();
