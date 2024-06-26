import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesModule } from './roles/roles.module';
import { StoresModule } from './stores/stores.module';
import { IsUserNotExistConstraint } from './users/validation/user-not-exist.rule';
import { IsStoreAlreadyExistConstraint } from './roles/validation/is-store-already-for-manage-order.rule';
import { IsUserAlreadyExistConstraint } from './users/validation/user-already-exist.rule';
import { UpdateRoleConstraintIdParam } from './roles/validation/update-role.rule';
import { StoreExistOrNotConstraint } from './stores/validation/store-exist-or-not.rule';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartsModule } from './carts/carts.module';
import { HomePageModule } from './home-page/home-page.module';
import { OrdersModule } from './orders/orders.module';
import { CategoryExistOrNotConstraint } from './categories/validation/category-exist-or-not.rule';
import { ProductExistOrNotConstraint } from './home-page/validation/product-exist-or-not.rule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    AuthModule,
    MailModule,
    UsersModule,
    RolesModule,
    StoresModule,
    ProductsModule,
    CartsModule,
    HomePageModule,
    OrdersModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    IsUserNotExistConstraint,
    IsStoreAlreadyExistConstraint,
    IsUserAlreadyExistConstraint,
    UpdateRoleConstraintIdParam,
    StoreExistOrNotConstraint,
    CategoryExistOrNotConstraint,
    ProductExistOrNotConstraint
  ],
})
export class AppModule {}
