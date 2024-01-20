import {
  Module
} from "@nestjs/common";
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from "src/mail/mail.module";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [
    UsersModule,
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: []
})
export class AuthModule {}