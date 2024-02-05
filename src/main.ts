import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ErrorHandlerExceptionFilter } from './filters/error-handler-exception.filter';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => {
          return {
            property: error.property,
            message:
              error.constraints === undefined
                ? error['children'].map((child) =>
                    Object.values(child['constraints']),
                  )
                : Object.values(error.constraints),
          };
        });
        return new BadRequestException(result);
      },
    }),
  );

  // enable DI for class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalFilters(new ErrorHandlerExceptionFilter());
  await app.listen(1812);
}
bootstrap();
