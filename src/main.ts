import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true
  }))
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI
  });
  await app.listen(3000);
}
bootstrap();
