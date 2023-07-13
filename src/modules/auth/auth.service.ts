import { UserService } from '@modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { AuthUser } from './auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private readonly jwt: JwtService,
  ) {}

  async validateToken(payload: AuthUser) {
    return {
      ...payload,
      blah: 'Giang',
    };
  }

  async register(role: UserRole) {
    const user = await this.user.createUser(role);
    const payload: AuthUser = { id: user.id, role: user.role };
    const result = await this.jwt.signAsync(payload, { expiresIn: '30 days' });
    return result;
  }
}
