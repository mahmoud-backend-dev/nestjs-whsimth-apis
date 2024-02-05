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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    IsUserNotExistConstraint,
    IsStoreAlreadyExistConstraint,
    IsUserAlreadyExistConstraint,
    UpdateRoleConstraintIdParam,
  ],
})
export class AppModule {}
