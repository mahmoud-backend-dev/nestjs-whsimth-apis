import { Module } from '@nestjs/common';
import { HomePageService } from './home-page.service';
import { HomePageController } from './home-page.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { Request } from 'express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { HomePage, HomePageSchema } from './schema/home-page.schema';
import { join } from 'path';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeature([
      { name: HomePage.name, schema: HomePageSchema },
    ]),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'home-page', 'uploads', 'main-section'),
        serveRoot: '/main-section',
      },
      {
        rootPath: join(__dirname, '..', 'home-page', 'uploads', 'section-two'),
        serveRoot:'/section-two'
      },
    ),
  ],
  controllers: [HomePageController],
  providers: [HomePageService],
})
export class HomePageModule {}
