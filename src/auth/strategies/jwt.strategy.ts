import { BadRequestException, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


export class JwtStrategy extends AuthGuard() {

  canActivate(context: ExecutionContext):boolean {
    const token = context.switchToHttp().getRequest().headers.authorization;
    if (!token && !token.startWith('Bearer'))
      throw new BadRequestException('No Bearer token provided');
    return true;
  }
}