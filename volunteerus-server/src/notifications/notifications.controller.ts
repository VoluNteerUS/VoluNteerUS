import { Controller, Get, Post, Body, Patch, Param, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './schemas/notification.schema';
import { UsersService } from '../users/users.service';
import { NotificationDto } from './dto/notification.dto';
import mongoose from 'mongoose';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    const user = await this.usersService.findOne(createNotificationDto.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND, {
        cause: new Error('User not found'),
      });
    }
    const notificationDto = new NotificationDto(
      user,
      createNotificationDto.message,
      new Date(),
      false
    );
    return await this.notificationsService.create(notificationDto);
  }

  @Get(':userId')
  async getNotifications(@Param('userId') userId: mongoose.Types.ObjectId): Promise<Notification[]> {
    return await this.notificationsService.getNotifications(userId);
  }

  @Patch(':notificationId')
  async markAsRead(@Param('notificationId') notificationId: string) {
    return await this.notificationsService.markAsRead(notificationId);
  }
}