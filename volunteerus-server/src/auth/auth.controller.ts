import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { error } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }

  @Get('verifyToken')
  verifyToken(@Request() req) {
    // Check if token is present in the header
    if (!req.headers.authorization) {
      return new HttpException('No token provided', 401);
    }
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.verify(token);
  }
}