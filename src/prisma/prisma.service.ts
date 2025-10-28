import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../generated/client.js';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    private readonly config: ConfigService,
  ) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });
  }
}
