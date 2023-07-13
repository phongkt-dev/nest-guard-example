import { ConfigModule } from '@nestjs/config';
import { DynamicModule, Logger, Module } from '@nestjs/common';
import { DbConfig } from './db.config';
import { DbService } from './db.service';

export interface DbModuleOptions {
  isGlobal?: boolean;
}

@Module({
  imports: [ConfigModule.forRoot({ load: [DbConfig] })],
  providers: [DbService, Logger],
  exports: [DbService],
})
export class DbModule {
  static register(options: DbModuleOptions): DynamicModule {
    return {
      module: DbModule,
      global: !!options?.isGlobal,
    };
  }
}
