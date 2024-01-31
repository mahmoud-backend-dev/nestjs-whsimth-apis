import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schema/store.schema';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 } from 'uuid';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Request } from 'express';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    ServeStaticModule.forRoot({
      rootPath: 'src/stores/uploads',
      serveRoot: '/uploads',
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: 'src/stores/uploads',
        filename: (req: Request, file: Express.Multer.File, cb) => {
          const ext = file.mimetype.split('/')[1];
          const filename: string = `stores-${v4()}.${ext}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
