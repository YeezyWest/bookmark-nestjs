import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthDto } from './dto/auth.dto.js';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signIn(dto: AuthDto) {
    //find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    //if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    //compare password
    //if password incorrect throw exception
    const passwordValid = await argon2.verify(
      user.hash,
      dto.password,
    );
    if (!passwordValid) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    const { hash: _omit, ...safeUser } = user;
    void _omit;
    //send back the user
    return safeUser;
  }
  async signUp(dto: AuthDto) {
    const hash = await argon2.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      const { hash: _omit, ...safeUser } = user;
      void _omit;
      return safeUser;
    } catch (error: unknown) {
      if (
        error instanceof
          PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException(
          'Credentials taken',
        );
      }
      throw error;
    }
  }
}
