import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';

// This is check Roles, this check this role is allowed or not
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user?.role) {
      console.warn('No role found in user object');
      return false;
    }

    // Check Roles
    const hasRole = requiredRoles.includes(user.role);
    console.log('RolesGuard Check:', { userRole: user.role, requiredRoles, hasRole });

    return hasRole;
  }
}
