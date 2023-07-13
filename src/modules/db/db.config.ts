import { registerAs } from '@nestjs/config';

export type DbConfig = {
  debug: boolean;
  logging: boolean;
};
export const DbConfig = registerAs<DbConfig>('db', () => ({
  debug: false,
  logging: false,
}));
