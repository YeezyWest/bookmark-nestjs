import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class AuthController {
  @Get('me')
  getMe() {
    return 'user info';
  }
}
