import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  signIn() {
    return 'i have signed in';
  }
  signUp() {
    return 'i have signed up';
  }
}
