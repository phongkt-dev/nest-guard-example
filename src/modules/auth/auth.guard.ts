import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { JWT_STRATEGY } from './auth.strategy';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY, ROLES_KEY } from './auth.decorator';
import { AUTH_REQUEST_PROPERTY_KEY } from './auth.config';
import { UserRole } from '@prisma/client';
import { AuthUser } from './auth.type';

@Injectable()
export class AuthGuard extends PassportAuthGuard(JWT_STRATEGY) {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  async canActivate(context: ExecutionContext) {
    // @Public()
    // Allow for Public, no authentication required
    // Usually use for health check, metrics,...
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Standard authentication check
    // Trigger auth strategy
    try {
      const canActivate = await super.canActivate(context);
      if (!canActivate) {
        return false;
      }
    } catch {
      if (isPublic) {
        return true;
      }
      throw new UnauthorizedException('Chua dang nhap');
    }

    // Get user from request context
    const request = this.getRequest(context);
    const auth = request[AUTH_REQUEST_PROPERTY_KEY] as AuthUser;
    if (!auth) {
      return false;
    }

    if (auth.role === UserRole.ADMINISTRATOR) {
      return true;
    }

    // @Role([])
    // User role check
    //
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    if (requiredRoles?.includes(auth.role)) {
      return true;
    }

    return false;
  }
}
