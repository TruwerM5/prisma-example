import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../generated/prisma/enums';
import { ROLES_KEY } from '../roles.decorator';
import { GetUserAndJwtExpirationDto } from '../auth/dto/get-user-and-jwt.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user }: { user: GetUserAndJwtExpirationDto } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
