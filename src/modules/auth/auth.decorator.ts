import {
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AUTH_REQUEST_PROPERTY_KEY } from './auth.config';
import { AuthUser } from './auth.type';

export const PUBLIC_KEY = 'AUTH_PUBLIC';
export const ROLES_KEY = 'AUTH_REQUIRED_ROLES';

// Allow to access resource under default guard
export const Public = () => SetMetadata(PUBLIC_KEY, true);

// Allowed roles to access resource under default guard
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator<boolean>(
  (throwOnNull = true, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const auth = request[AUTH_REQUEST_PROPERTY_KEY] as AuthUser;
    if (auth) {
      return auth;
    }
    if (throwOnNull) {
      throw new UnauthorizedException('Invalid user session');
    }
    return null;
  },
);
