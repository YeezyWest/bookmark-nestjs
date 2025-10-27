import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { BookmarkModule } from './bookmark/bookmark.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, PrismaModule],
})
export class AppModule {}
