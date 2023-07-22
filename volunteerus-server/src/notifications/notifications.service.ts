import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) 
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name) 
    private userModel: Model<UserDocument>,
  ) {}

  async create(notificationDto: NotificationDto): Promise<Notification> {
    const notification = new this.notificationModel(notificationDto);
    return await notification.save();
  }

  async getNotifications(userId: mongoose.Types.ObjectId): Promise<Notification[]> {
    const user = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND, {
        cause: new Error('User not found'),
      });
    }
    return await this.notificationModel.find({ user: user._id }).exec();
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(notificationId).exec();
    if (!notification) {
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND, {
        cause: new Error('Notification not found'),
      });
    }
    notification.read = true;
    return notification.save();
  }

}