import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { DbConfig } from './db.config';

@Injectable()
export class DbService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private config: DbConfig;
  constructor(configService: ConfigService, logger: Logger) {
    const config = configService.get<DbConfig>('db');
    let options = {};
    if (config.logging) {
      options = {
        log: [
          {
            emit: 'event',
            level: 'query',
          },
          {
            emit: 'event',
            level: 'error',
          },
          {
            emit: 'event',
            level: 'info',
          },
          {
            emit: 'event',
            level: 'warn',
          },
        ],
      };
    }
    super(options);
    this.registerLoggingEvents(logger);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    if (process.env.ENABLE_SHUTDOWN_HOOKS !== 'true') {
      return;
    }
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  registerLoggingEvents(logger: Logger) {
    const eventNames = ['info', 'query', 'warn', 'error'];
    for (const eventName of eventNames) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.$on(eventName, this.logHandler(eventName, logger));
    }
  }

  logHandler(eventName: Prisma.LogLevel, logger: Logger) {
    const context = 'DbService';
    // Info
    if (eventName === 'info') {
      return (event: Prisma.LogEvent) => {
        const { message, target, timestamp } = event;
        logger.log(message, context, target, timestamp);
      };
    }
    // Warning
    if (eventName === 'warn') {
      return (event: Prisma.LogEvent) => {
        const { message, target, timestamp } = event;
        logger.warn(message, context, target, timestamp);
      };
    }
    // Error
    if (eventName === 'error') {
      return (event: Prisma.LogEvent) => {
        const { message, target, timestamp } = event;
        logger.error(message, context, target, timestamp);
      };
    }
    // Query
    if (eventName === 'query') {
      return (event: Prisma.QueryEvent) => {
        const { query, params, duration, target, timestamp } = event;
        logger.log(query, context, params, duration, target, timestamp);
      };
    }
  }
}
