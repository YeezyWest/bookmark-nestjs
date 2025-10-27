import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { AuthDto } from './dto/index.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() dto: AuthDto) {
    console.log({ dto });
    return this.authService.signUp();
  }

  @Post('signIn')
  signIn() {
    return this.authService.signIn();
  }
}
