import { Module } from '@nestjs/common';
import { AuthController } from './user.controller.js';

@Module({
  controllers: [AuthController],
})
export class UserModule {}
