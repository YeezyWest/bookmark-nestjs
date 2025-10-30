import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard.js';
import { GetUser } from '../auth/decorator/get-user.decorator.js';
import { User } from '../generated/client.js';
import { EditUserDto } from './dto/edit-user.dto.js';
import { UserService } from './user.service.js';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: Omit<User, 'hash'>) {
    return user;
  }

  @Patch()
  editMe(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editMe(userId, dto);
  }
}
