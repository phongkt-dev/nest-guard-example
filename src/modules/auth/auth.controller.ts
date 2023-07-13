import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '@prisma/client';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('register')
  @Public()
  async register(@Query('role') role: UserRole) {
    const result = await this.auth.register(role);
    return result;
  }
}
