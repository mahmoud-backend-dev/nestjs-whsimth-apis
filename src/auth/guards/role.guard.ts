import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";


@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) { }
  
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;
    const request = context.switchToHttp().getRequest<Request>();
    if (request['user']['role'] === null) {
      if (roles.includes('user'))
        return true;
      throw new UnauthorizedException(
        'You do not have permission to access this resource',
      );
      
    }
    const permissions = request['user']['role']['permissions'];
    if (!matchPermissions(permissions, roles))
      throw new UnauthorizedException('You do not have permission to access this resource');
    return true;
  }

}

function matchPermissions(permissions: string[], roles: string[]) {
  return permissions.some((permission) => roles.includes(permission));
}