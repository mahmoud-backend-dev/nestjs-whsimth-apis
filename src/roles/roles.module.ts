import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schema/role.schema';
import { UsersModule } from 'src/users/users.module';
import { StoresModule } from 'src/stores/stores.module';

@Module({
  imports: [
    UsersModule,
    StoresModule,
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [MongooseModule]
})
export class RolesModule {}
