import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:123@localhost:5432/nest?schema=public',
        },
      },
    });
  }
}
