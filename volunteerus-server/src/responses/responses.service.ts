import { Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Response, ResponseDocument } from './schemas/response.schema';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { PaginationResult } from '../types/pagination';
import * as moment from 'moment';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationDto } from '../notifications/dto/notification.dto';
import { Notification, NotificationDocument } from '../notifications/schemas/notification.schema';
import { EventDocument } from '../events/schemas/event.schema';

@Injectable()
export class ResponsesService {
    constructor(
      @InjectModel(Response.name) 
      private responsesModel: Model<ResponseDocument>,
      @InjectModel(Event.name)
      private eventsModel: Model<EventDocument>,
      @InjectModel(User.name)
      private usersModel: Model<UserDocument>,
      @InjectModel(Notification.name) 
      private notificationsModel: Model<NotificationDocument>,
      private notificationsGateway: NotificationsGateway
    ) { }

  public async create(createResponseDto: CreateResponseDto) {
    const user = await this.usersModel.findById(createResponseDto.user);
    const event = await this.eventsModel.findById(createResponseDto.event);
    const newNotification = new NotificationDto(
      user, 
      `${event.title}: Response Sent!`, 
      new Date(), 
      false
    );
    this.notificationsModel.create(newNotification);
    this.notificationsGateway.sendNotificationToUser(user._id, newNotification);
    return new this.responsesModel(createResponseDto).save();
  }

  findAll() {
    return this.responsesModel.find().exec();
  }

  public async findOne(id: mongoose.Types.ObjectId): Promise<Response> {
    const response = await this.responsesModel.findById(id).populate("selected_users", "-password -registered_on -role -__v").exec();
    return response;
  }

  public async getResponsesByUser(id: mongoose.Types.ObjectId): Promise<Response[]> {
    const responses = await this.responsesModel.find({ user: id }).exec();
    return responses;
  }

  public async getPastAcceptedResponsesByUser(id: mongoose.Types.ObjectId, page: number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const data = await this.responsesModel.find({ user: id}).populate('event', 'title date defaultHours').skip(skip).limit(limit).exec();
    // Filter out responses that are accepted and in the past
    const pastAcceptedResponses = data.filter(response => moment(`${response?.event['date'][1]} ${response?.event['date'][3]}`).isBefore(moment()) && response.status === "Accepted");
    const items = await this.responsesModel.find({ user: id}).populate('event', 'title date')
    const totalItems = items.filter(response => moment(`${response?.event['date'][1]} ${response?.event['date'][3]}`).isBefore(moment()) && response.status === "Accepted").length;
    const totalPages = Math.ceil(totalItems / limit);
    return new PaginationResult<Response>(pastAcceptedResponses, page, totalItems, totalPages);
  }

  public async getTotalHours(id: mongoose.Types.ObjectId): Promise<number> {
    const userResponses = await this.responsesModel.find({ user: id}).populate('event', 'title date defaultHours');
    const pastAcceptedUserResponses = userResponses.filter(response => moment(`${response?.event['date'][1]} ${response?.event['date'][3]}`).isBefore(moment()) && response.status === "Accepted");
    const numberOfResponses = pastAcceptedUserResponses.length;
    let totalHours = 0;
    for (let i = 0; i < numberOfResponses; i++) {
      const shifts = pastAcceptedUserResponses[i]?.shifts.map((shift, index) => shift ? index : -1).filter(days => days != -1);
      const eventHours = shifts?.reduce((sum, shift) => sum + (pastAcceptedUserResponses[i]?.hours[shift] === -1 ? pastAcceptedUserResponses[i]?.event['defaultHours'][shift] : pastAcceptedUserResponses[i]?.hours[shift]), 0);
      totalHours += eventHours;
    }
    return totalHours;
  }

  public async getAcceptedResponsesByUser(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.responsesModel.find({ user: id }).skip(skip).limit(limit).exec(),
      this.responsesModel.countDocuments({ user: id, status: "Accepted" }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    const acceptedResponses = data.filter(response => response.status === "Accepted");
    return new PaginationResult<Response>(acceptedResponses, page, totalItems, totalPages);
  }

  public async getPendingResponsesByUser(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.responsesModel.find({ user: id }).skip(skip).limit(limit).exec(),
      this.responsesModel.countDocuments({ user: id, status: "Pending" }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    const pendingResponses = data.filter(response => response.status === "Pending");
    return new PaginationResult<Response>(pendingResponses, page, totalItems, totalPages);
  }

  public async getRejectedResponsesByUser(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.responsesModel.find({ user: id }).skip(skip).limit(limit).exec(),
      this.responsesModel.countDocuments({ user: id, status: "Rejected" }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    const rejectedResponses = data.filter(response => response.status === "Rejected");
    return new PaginationResult<Response>(rejectedResponses, page, totalItems, totalPages);
  }

  public async getResponsesByEvent(id: mongoose.Types.ObjectId): Promise<Response[]> {
    const responses = await this.responsesModel.find({ event: id }).populate('user', 'full_name').exec();
    return responses;
  }

  public async getAcceptedResponsesByEventAndDate(id: mongoose.Types.ObjectId, numberOfDays: number, page:number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const filterBody = {};
    filterBody['event'] = id;
    filterBody['status'] = "Accepted";
    filterBody[`shifts.${numberOfDays}`] = true
    const [data, totalItems] = await Promise.all([
      this.responsesModel.find(filterBody).populate('user', "-password -registered_on -role -__v").skip(skip).limit(limit).exec(),
      this.responsesModel.countDocuments(filterBody).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    // const acceptedResponses = data.filter(response => response.status === "Accepted");
    // return new PaginationResult<Response>(acceptedResponses, page, totalItems, totalPages);
    return new PaginationResult<Response>(data, page, totalItems, totalPages);
  }

  public async getAcceptedResponsesByEvent(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.responsesModel.find({ event: id, status: "Accepted" }).populate('user', "-password -registered_on -role -__v").skip(skip).limit(limit).exec(),
      this.responsesModel.countDocuments({ event: id, status: "Accepted" }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    // const acceptedResponses = data.filter(response => response.status === "Accepted");
    // return new PaginationResult<Response>(acceptedResponses, page, totalItems, totalPages);
    return new PaginationResult<Response>(data, page, totalItems, totalPages);
  }

  public async getPendingResponsesByEvent(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.responsesModel.find({ event: id, status: "Pending" }).populate('user', 'full_name').skip(skip).limit(limit).exec(),
      this.responsesModel.countDocuments({ event: id, status: "Pending" }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    // const pendingResponses = data.filter(response => response.status === "Pending");
    // return new PaginationResult<Response>(pendingResponses, page, totalItems, totalPages);
    return new PaginationResult<Response>(data, page, totalItems, totalPages);
  }

  public async getRejectedResponsesByEvent(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.responsesModel.find({ event: id, status: "Rejected" }).populate('user', 'full_name').skip(skip).limit(limit).exec(),
      this.responsesModel.countDocuments({ event: id, status: "Rejected" }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    // const rejectedResponses = data.filter(response => response.status === "Rejected");
    // return new PaginationResult<Response>(rejectedResponses, page, totalItems, totalPages);
    return new PaginationResult<Response>(data, page, totalItems, totalPages);
  }

  findOneByUser(user: User): Promise<Response> {
    return this.responsesModel.findOne(user).exec();
  }

  async update(id: mongoose.Types.ObjectId, updateResponseDto: UpdateResponseDto) {
    // Send notification to user
    if (updateResponseDto.status === "Accepted") {
      const user = await this.usersModel.findOne(updateResponseDto.user);
      const event = await this.eventsModel.findById(updateResponseDto.event);
      const newNotification = new NotificationDto(
        user, 
        `${event.title}: Response Accepted!`, 
        new Date(), 
        false
      );
      this.notificationsModel.create(newNotification);
      this.notificationsGateway.sendNotificationToUser(user.id, newNotification);
    } else if (updateResponseDto.status === "Rejected") {
      const user = await this.usersModel.findOne(updateResponseDto.user);
      const event = await this.eventsModel.findById(updateResponseDto.event);
      const newNotification = new NotificationDto(
        user, 
        `${event.title}: Response Rejected :(`, 
        new Date(), 
        false
      );
      this.notificationsModel.create(newNotification);
      this.notificationsGateway.sendNotificationToUser(user.id, newNotification);
    }
    return this.responsesModel.findByIdAndUpdate(id, updateResponseDto).exec();
  }

  updateAll(updateResponseDto: UpdateResponseDto) {
    return this.responsesModel.updateMany({}, updateResponseDto);
  }

  public async remove(id: mongoose.Types.ObjectId): Promise<Response> {
    const deletedResponse = await this.responsesModel.findByIdAndDelete(id);
    return deletedResponse;
  }
}
