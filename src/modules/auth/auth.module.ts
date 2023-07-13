import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AUTH_REQUEST_PROPERTY_KEY, AuthConfig } from './auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthStrategy } from './auth.strategy';
import { AuthService } from './auth.service';
import { UserModule } from '@modules/user/user.module';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ load: [AuthConfig] }),
    PassportModule.register({
      property: AUTH_REQUEST_PROPERTY_KEY,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          publicKey: Buffer.from(
            config.get<string>('auth.publicKey'),
            'base64',
          ),
          privateKey: Buffer.from(
            config.get<string>('auth.privateKey'),
            'base64',
          ),
          signOptions: {
            algorithm: 'RS256',
          },
          verifyOptions: { algorithms: ['RS256', 'HS256'] },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'JWT_SERVICE',
      useClass: JwtService,
    },
    {
      provide: 'JWT_STRATEGY',
      useClass: AuthStrategy,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  exports: [],
})
export class AuthModule {}
