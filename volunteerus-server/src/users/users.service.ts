import { Body, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationResult } from '../types/pagination';
import { Organization, OrganizationDocument } from '../organizations/schemas/organization.schema';
import { Event, EventDocument } from "../events/schemas/event.schema";
import { Response, ResponseDocument } from "../responses/schemas/response.schema";
import { Notification, NotificationDocument } from '../notifications/schemas/notification.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationDto } from '../notifications/dto/notification.dto';
import * as moment from "moment";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    @InjectModel(Organization.name) private organizationsModel: Model<OrganizationDocument>,
    @InjectModel(Event.name) private eventsModel: Model<EventDocument>,
    @InjectModel(Response.name) private responsesModel: Model<ResponseDocument>,
    @InjectModel(Notification.name) private notificationsModel: Model<NotificationDocument>,
    private notificationsGateway: NotificationsGateway
  ) { }

  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // Check if email is valid
    if (!createUserDto.email.includes("@")) {
      throw new HttpException('Please enter a valid email address!', 403, {
        cause: new Error('Please enter a valid email address!')
      })
    }

    if (!createUserDto.email.includes("nus.edu")) {
      throw new HttpException('Please enter a NUS email address!', 403, {
        cause: new Error('Please enter a NUS email address!')
      })
    }

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

    // Filter by role
    switch (role) {
      case 'Admin':
        data = await this.usersModel.find({
          role: 'ADMIN',
          $or: [
            { email: new RegExp(search, 'i') },
            { full_name: new RegExp(search, 'i') }
          ]
        }).sort({ full_name: 1 }).select('-password').skip(skip).limit(limit).exec();
        total = data.length;
        page = 1;
        skip = 0;
        break;
      case 'Committee Member':
        data = await this.usersModel.find({
          role: 'COMMITTEE MEMBER',
          $or: [
            { email: new RegExp(search, 'i') },
            { full_name: new RegExp(search, 'i') }
          ]
        }).sort({ full_name: 1 }).select('-password').skip(skip).limit(limit).exec();
        total = data.length;
        page = 1;
        skip = 0;
        break;
      case 'User':
        data = await this.usersModel.find({
          role: 'USER',
          $or: [
            { email: new RegExp(search, 'i') },
            { full_name: new RegExp(search, 'i') }
          ]
        }).sort({ full_name: 1 }).select('-password').skip(skip).limit(limit).exec();
        total = data.length;
        page = 1;
        skip = 0;
        break;
      default:
        data = await this.usersModel.find({
          $or: [
            { email: new RegExp(search, 'i') },
            { full_name: new RegExp(search, 'i') }
          ]
        }).sort({ full_name: 1 }).select('-password').skip(skip).limit(limit).exec();
        total = await this.usersModel.countDocuments();
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

  public async count(): Promise<number> {
    return this.usersModel.countDocuments();
  }

  public async findOne(_id: mongoose.Types.ObjectId): Promise<User> {
    return this.usersModel.findById(_id).select('-password');
  }

  public async findOneByEmail(email: string): Promise<User> {
    return await this.usersModel.findOne({ email: email });
  }

  public async findUsers(query: string): Promise<User[]> {
    query = query.replace(/[\[\(\)\?\*\\\|]/g, "\\$&");
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

  public async findUserRecommendedEvents(_id: string) {
    // Get accepted responses
    let acceptedResponses = await this.responsesModel.find({
      user: new mongoose.Types.ObjectId(_id),
      status: "Accepted",
    });

    // Get accepted event ids
    let acceptedEvents = acceptedResponses.map(response => response.event);

    // Get past events
    let pastEvents = await this.eventsModel.find({
      _id: { $in: acceptedEvents },
      "date.0": {
        $lt: moment().format('YYYY-MM-DD')
      },
    }).exec();

    // Get past event categories
    let pastEventCategories = pastEvents.map(event => event.category).flat();
    // Remove duplicates
    pastEventCategories = [...new Set(pastEventCategories)];

    if (pastEventCategories.length == 0) {
      // Get future events with categories that contain past event categories
      let futureEvents = await this.eventsModel.find({
        _id: { $nin: acceptedEvents },
        "date.0": {
          $gte: moment().format('YYYY-MM-DD')
        },
      }).exec();
      
      return futureEvents;
    } else {
      // Get future events with categories that contain past event categories
      let futureEvents = await this.eventsModel.find({
        _id: { $nin: acceptedEvents },
        "date.0": {
          $gte: moment().format('YYYY-MM-DD')
        },
        category: { $in: pastEventCategories }
      }).exec();

      return futureEvents;
    }
  }

  public async findUserUpcomingEvents(_id: string) {
    let acceptedResponses = await this.responsesModel.find({
      user: new mongoose.Types.ObjectId(_id),
      status: "Accepted",
    });

    let acceptedEvents = acceptedResponses.map(response => response.event);

    let upcomingEvents = await this.eventsModel.find({ 
      _id: { $in: acceptedEvents },
      "date.0": {
        $gte: moment().format('YYYY-MM-DD')
      },
    }).exec();

    // Remind users of upcoming events 1 day before (ensure it is only sent once)
    upcomingEvents.forEach(async event => {
      let eventDate = moment(event.date[0]).subtract(1, 'days').format('YYYY-MM-DD');
      let today = moment().format('YYYY-MM-DD');
      if (eventDate == today && !event.reminderSent) {
        let user = await this.usersModel.findById(_id);
        const newNotification = new NotificationDto(user, `Reminder: ${event.title} is tommorow!`, new Date(), false);
        await this.notificationsModel.create(newNotification);
        this.notificationsGateway.sendNotificationToUser(user._id, newNotification);
        await this.eventsModel.updateOne({ _id: event._id }, { reminderSent: true }).exec();
      }
    });

    return upcomingEvents;
  }

  public async getCommitteeMemberCount(): Promise<number> {
    // Get all committee members from database and return unique user count
    const committee_members = await this.organizationsModel.find().select('committee_members');
    const committee_member_ids = committee_members.map(committee_member => committee_member.committee_members);
    const unique_committee_member_ids = [...new Set(committee_member_ids.flat())];
    return unique_committee_member_ids.length;
  }

  public async update(_id: mongoose.Types.ObjectId, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersModel.findByIdAndUpdate(_id, updateUserDto);
  }

  public async updatePassword(email: string, password: string): Promise<User> {
    // Generate salt to hash password
    const salt = await bcrypt.genSalt(10);
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
    // Check if new password is the same as the previous one
    const user = await this.usersModel.findOne({ email: email });
    if (!user) {
      throw new HttpException('No user found', 401, {
        cause: new Error('No user found')
      });
    }
    console.log(user);
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      throw new HttpException('Password cannot be the same as the previous one', 401, {
        cause: new Error('Password cannot be the same as the previous one')
      });
    }
    // Hash password
    const new_password_hash = await bcrypt.hash(password, salt);
    // Set user password as hashed password
    await this.usersModel.updateOne({ email: email }, { password: new_password_hash });
    // Return updated user
    return await this.usersModel.findOne({ email: email }).select('-password');
  }

  public async delete(_id: mongoose.Types.ObjectId): Promise<User> {
    const responses = await this.responsesModel.find({ user: _id }).exec();
    const numberOfResponses = responses.length;
    for (let i = 0; i < numberOfResponses; i++) {
      await this.responsesModel.findByIdAndDelete(responses[i]._id);
    }
    return this.usersModel.findByIdAndDelete(_id);
  }
}