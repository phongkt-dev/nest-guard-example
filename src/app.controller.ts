import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser, Public, Roles } from '@modules/auth/auth.decorator';
import { UserRole } from '@prisma/client';
import { AuthUser } from '@modules/auth/auth.type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getBothasdasf(@CurrentUser(false) user: AuthUser) {
    return { user };
  }

  @Get('/user')
  getUser(): string {
    return 'user';
  }

  @Get('/manager')
  @Roles(UserRole.MANAGER)
  getManager(): string {
    return 'manager';
  }

  @Get('/admin')
  @Roles(UserRole.ADMINISTRATOR)
  getAdmin(): string {
    return 'admin';
  }

  @Get('/mix')
  @Roles(UserRole.ADMINISTRATOR, UserRole.MANAGER)
  getBoth(@CurrentUser() user: AuthUser) {
    return { user };
  }
}
