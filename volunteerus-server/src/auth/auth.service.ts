import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const validPassword = await bcrypt.compare(pass, user.password);
      if (validPassword) {
        const { password, ...result } = user;
        return user;
      }
      else {
        throw new HttpException('Invalid password', 401, {
          cause: new Error('Invalid password')
        });
      }
    }
    throw new HttpException('Invalid username or password', 401, {
      cause: new Error('Invalid username or password')
    });
  }

  async login(user: any) {
    const payload = { email: user.email, userId: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Verify JWT token
  async verify(token: string) {
    try {
      return this.jwtService.verify(token);
    }
    catch (err) {
      throw new HttpException(err, 401);
    }
  }

  // Decode JWT token
  async getProfile(user: any) {
    return this.usersService.findOneByEmail(user.email);
  }
}
