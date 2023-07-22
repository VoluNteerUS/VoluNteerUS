import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

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
      return new HttpException('No token provided', 401, {
        cause: new Error('No token provided')
      });
    }
    const token = req.headers.authorization.split(' ')[1];
    return this.authService.verify(token);
  }

  @Post('/passwordResetRequest')
  async passwordResetRequest(@Body() body) {
    return this.authService.passwordResetRequest(body.email);
  }

  @Post('/passwordReset')
  async passwordReset(@Body() body) {
    // Check if password and confirm password match
    if (body.new_password !== body.confirm_new_password) {
      return new HttpException('Passwords do not match', 401, {
        cause: new Error('Passwords do not match')
      });
    }
    return this.authService.passwordReset(body.token, body.email, body.new_password);
  }

  @Post('/changePassword')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req, @Body() body) {
    // Check if old password is correct
    const user = await this.authService.validateUser(req.user.email, body.current_password);
    if (!user) {
      return new HttpException('Current password is invalid', 401, {
        cause: new Error('Current password is invalid')
      });
    }
    // Check if password and confirm password match
    if (body.new_password !== body.confirm_new_password) {
      return new HttpException('Passwords do not match', 401, {
        cause: new Error('Passwords do not match')
      });
    }
    return this.authService.changePassword(req.user, body.new_password);
  }

  @Delete('/deleteAccount')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Request() req) {
    return this.authService.deleteAccount(req.user);
  }
    
}