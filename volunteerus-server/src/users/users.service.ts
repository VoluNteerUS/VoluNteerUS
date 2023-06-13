import { Body, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationResult } from 'src/types/pagination';
import { Organization, OrganizationDocument } from 'src/organizations/schemas/organization.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @InjectModel(Organization.name) private organizationsModel: Model<OrganizationDocument>
  ) { }

  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // Check if user exists in database through email and username
    const email = await this.usersModel.findOne({ email: createUserDto.email });

    if (email) {
      throw new HttpException('This email has been taken.', 403, {
        cause: new Error('This email has been taken.')
      });
    } else {
      // Generate salt to hash password
      const salt = await bcrypt.genSalt(10);
      // Get password plaintext
      const password = createUserDto.password;
      // Check password length
      if (password.length < 10) {
        throw new HttpException('Password must be at least 10 characters long.', 403, {
          cause: new Error('Password must be at least 10 characters long.')
        });
      }
      // Check if password contains uppercase letter, lowercase letter, and number
      if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{10,}$/)) {
        throw new HttpException('Password must contain at least one uppercase letter, one lowercase letter, and one number.', 403, {
          cause: new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number.')
        });
      }
      // Hash password
      const password_hash = await bcrypt.hash(password, salt);
      // Set user password as hashed password
      createUserDto.password = password_hash;

      return new this.usersModel(createUserDto).save();
    }
  }

  public async findAll(page: number, limit: number, search: string, role: string, sortBy: string): Promise<PaginationResult<User>> {
    let data: User[];
    let total: number;
    let skip = (page - 1) * limit;

    if (search !== '') {
      data = await this.usersModel.find({
        $or: [
          { email: new RegExp(search, 'i') },
          { full_name: new RegExp(search, 'i') }
        ]
      }).select('-password').skip(skip).limit(limit).exec();
      total = data.length;
    } else {
      data = await this.usersModel.find().select('-password').skip(skip).limit(limit).exec();
      total = await this.usersModel.countDocuments();
    }
    // Filter by role
    switch (role) {
      case 'All':
        break;
      case 'Admin':
        data = await this.usersModel.find({ role: 'ADMIN' }).select('-password').skip(skip).limit(limit).exec();
        total = data.length;
        page = 1;
        skip = 0;
        break;
      case 'User':
        data = await this.usersModel.find({ role: 'USER' }).select('-password').skip(skip).limit(limit).exec();
        total = data.length;
        page = 1;
        skip = 0;
        break;
      default:
        break;
    }

    // Sort By
    switch (sortBy) {
      case 'Name':
        data = data.sort((a, b) => a.full_name.localeCompare(b.full_name));
        break;
      case 'Role':
        data = data.sort((a, b) => a.role.localeCompare(b.role));
        break;
      default:
        data = data.sort((a, b) => a.full_name.localeCompare(b.full_name));
        break;
    }

    const totalPages = Math.ceil(total / limit);
    return new PaginationResult<User>(data, page, total, totalPages);
  }

  public async findOne(_id: mongoose.Types.ObjectId): Promise<User> {
    return this.usersModel.findById(_id).select('-password');
  }

  public async findOneByEmail(email: string): Promise<User> {
    return this.usersModel.findOne({ email: email });
  }

  public async findUsers(query: string): Promise<User[]> {
    return this.usersModel.find({ 
      $or: [
        { email: new RegExp(query, 'i') }, 
        { full_name: new RegExp(query, 'i') }
      ] 
    }).select('-password');
  }

  public async findUserOrganizations(_id: string): Promise<Organization[]> {
    return this.organizationsModel.find({ committee_members: _id }).select('_id name image_url');
  }

  public async update(_id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersModel.findByIdAndUpdate(_id, updateUserDto);
  }

  public async delete(_id: string): Promise<User> {
    return this.usersModel.findByIdAndDelete(_id);
  }
  
}