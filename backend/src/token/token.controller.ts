import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  registerDevice(@Body('token') token: string) {
    if (!token) return { success: false, message: 'Token is required' };
    this.tokenService.registerToken(token);
    return { success: true };
  }
}
