import { registerAs } from '@nestjs/config';
import { env } from '@utils/env';

export const AUTH_REQUEST_PROPERTY_KEY = 'auth';

export const AuthConfig = registerAs('auth', () => ({
  publicKey: env('AUTH_PUBLIC_KEY', ''),
  privateKey: env('AUTH_PRIVATE_KEY', ''),
  sessionExpiresIn: parseInt(process.env.AUTH_SESSION_EXPIRES_IN) || 2592000, // seconds, 30 days
}));
