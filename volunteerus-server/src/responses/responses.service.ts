import { Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Response, ResponseDocument } from './schemas/response.schema';
import mongoose, { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { PaginationResult } from '../types/pagination';

@Injectable()
export class ResponsesService {
    constructor(@InjectModel(Response.name) private responsesModel: Model<ResponseDocument>) { }

  create(createResponseDto: CreateResponseDto) {
    return new this.responsesModel(createResponseDto).save();
  }

  findAll() {
    return this.responsesModel.find().exec();
  }

  public async findOne(id: mongoose.Types.ObjectId): Promise<Response> {
    const response = await this.responsesModel.findById(id).exec();
    return response;
  }

  public async getResponsesByUser(id: mongoose.Types.ObjectId): Promise<Response[]> {
    const responses = await this.responsesModel.find({ user: id }).exec();
    return responses;
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

  public async getAcceptedResponsesByEvent(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.responsesModel.find({ event: id }).populate('user', 'full_name').skip(skip).limit(limit).exec(),
      this.responsesModel.countDocuments({ event: id, status: "Accepted" }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    const acceptedResponses = data.filter(response => response.status === "Accepted");
    return new PaginationResult<Response>(acceptedResponses, page, totalItems, totalPages);
  }

  public async getPendingResponsesByEvent(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.responsesModel.find({ event: id }).populate('user', 'full_name').skip(skip).limit(limit).exec(),
      this.responsesModel.countDocuments({ event: id, status: "Pending" }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    const pendingResponses = data.filter(response => response.status === "Pending");
    return new PaginationResult<Response>(pendingResponses, page, totalItems, totalPages);
  }

  public async getRejectedResponsesByEvent(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Response>> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.responsesModel.find({ event: id }).populate('user', 'full_name').skip(skip).limit(limit).exec(),
      this.responsesModel.countDocuments({ event: id, status: "Rejected" }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    const rejectedResponses = data.filter(response => response.status === "Rejected");
    return new PaginationResult<Response>(rejectedResponses, page, totalItems, totalPages);
  }

  findOneByUser(user: User): Promise<Response> {
    return this.responsesModel.findOne(user).exec();
  }

  update(id: mongoose.Types.ObjectId, updateResponseDto: UpdateResponseDto) {
    return this.responsesModel.findByIdAndUpdate(id, updateResponseDto).exec();
  }

  public async remove(id: mongoose.Types.ObjectId): Promise<Response> {
    const deletedResponse = await this.responsesModel.findByIdAndDelete(id);
    return deletedResponse;
  }
}
