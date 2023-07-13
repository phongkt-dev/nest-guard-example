import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { AuthUser } from './auth.type';

export const JWT_STRATEGY = 'jwt';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    readonly config: ConfigService,
    private readonly auth: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256', 'HS256'],
      secretOrKey: Buffer.from(config.get<string>('auth.privateKey'), 'base64'),
    });
  }

  async validate(payload: AuthUser) {
    const user = await this.auth.validateToken(payload);
    return user;
  }
}
