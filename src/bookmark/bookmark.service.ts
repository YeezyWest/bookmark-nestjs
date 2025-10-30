import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '../generated/client.js';
import { CreateBookmarkDto } from './dto/create-bookmark.dto.js';
import { EditBookmarkDto } from './dto/edit-bookmark.dto.js';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }
  async createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ) {
    const bookmark =
      await this.prisma.bookmark.create({
        data: {
          userId,
          title: dto.title,
          description: dto.description ?? null,
          link: dto.url,
        },
      });
    return bookmark;
  }

  getBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    return this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });
  }

  async editBookmark(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    //get the bookmark by id
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    //check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException(
        'Access to resource denied',
      );
    }
    const data: Prisma.BookmarkUpdateInput = {};
    if (dto.title !== undefined) {
      data.title = dto.title;
    }
    if (dto.description !== undefined) {
      data.description = dto.description;
    }
    if (dto.url !== undefined) {
      data.link = dto.url;
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data,
    });
  }

  async deleteBookmark(
    userId: number,
    bookmarkId: number,
  ) {
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    //check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException(
        'Access to resource denied',
      );
    }

    //delete the bookmark
    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
