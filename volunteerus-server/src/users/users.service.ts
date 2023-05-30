import { Body, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<UserDocument>) { }

  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // Check if user exists in database through email and username
    const email = await this.usersModel.findOne({ email: createUserDto.email });

    if (email) {
      throw new HttpException('This email has been taken.', 403);
    } else {
      // Generate salt to hash password
      const salt = await bcrypt.genSalt(10);
      // Get password plaintext
      const password = createUserDto.password;
      // Check password length
      if (password.length < 10) {
        throw new HttpException('Password must be at least 10 characters long.', 403);
      }
      // Check if password contains uppercase letter, lowercase letter, and number
      if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,}$/)) {
        throw new HttpException('Password must contain at least one uppercase letter, one lowercase letter, and one number.', 403);
      }
      // Hash password
      const password_hash = await bcrypt.hash(password, salt);
      // Set user password as hashed password
      createUserDto.password = password_hash;

      return new this.usersModel(createUserDto).save();
    }
  }

  public async findAll(): Promise<User[]> {
    return this.usersModel.find().exec();
  }

  public async findOne(_id: string): Promise<User> {
    return this.usersModel.findOne({ _id: _id });
  }

  public async findOneByEmail(email: string): Promise<User> {
    return this.usersModel.findOne({ email: email });
  }

  public async update(_id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersModel.findByIdAndUpdate(_id, updateUserDto);
  }

  public async delete(_id: string): Promise<User> {
    return this.usersModel.findByIdAndDelete(_id);
  }
  
}