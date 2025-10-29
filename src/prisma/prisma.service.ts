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
          url: config.getOrThrow<string>(
            'DATABASE_URL',
          ),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
