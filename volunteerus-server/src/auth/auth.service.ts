import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/token.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    @InjectModel(Token.name)
    private tokenModel: Model<Token>,
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

  // Password reset request
  async passwordResetRequest(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new HttpException('Invalid email address!', 401, {
        cause: new Error('Invalid email address!')
      });
    }
    // Find if a token already exists for this user and delete it
    let token = await this.tokenModel.findOne({ user_id: user });
    if (token) {
      await token.deleteOne();
    }

    // Generate a new token
    let resetToken = crypto.randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(resetToken, salt);
    await this.tokenModel.create({
      token: hash,
      user_id: user,
    });

    // Send email with reset token
    return this.mailerService.sendResetPasswordEmail(user, resetToken);
  }

  // Password reset
  async passwordReset(token: string, email: string, password: string) {
    // Check if the password reset token is valid
    const user = await this.usersService.findOneByEmail(email);
    let passwordResetToken = await this.tokenModel.findOne({ user_id: user });
    if (!passwordResetToken) {
      throw new HttpException('Invalid or expired password reset token', 401, {
        cause: new Error('Invalid or expired password reset token')
      });
    }

    const validToken = await bcrypt.compare(token, passwordResetToken.token);
    if (!validToken) {
      throw new HttpException('Invalid or expired password reset token', 401, {
        cause: new Error('Invalid or expired password reset token')
      });
    }

    // Update password
    await this.usersService.updatePassword(user.email, password);
    await passwordResetToken.deleteOne();
  }

  // Change password
  async changePassword(user: any, password: string) {
    await this.usersService.updatePassword(user.email, password);
  }

  // Delete account
  async deleteAccount(user: any) {
    await this.usersService.delete(user.id);
  }
}
