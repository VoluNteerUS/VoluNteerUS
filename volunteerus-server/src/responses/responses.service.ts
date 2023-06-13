import { Injectable } from '@nestjs/common';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Response, ResponseDocument } from './schemas/response.schema';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

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

  findOneByUser(user: User): Promise<Response> {
    return this.responsesModel.findOne(user).exec();
  }

  update(id: mongoose.Types.ObjectId, updateResponseDto: UpdateResponseDto) {
    return this.responsesModel.findByIdAndUpdate(id, updateResponseDto).exec();
  }

  remove(id: mongoose.Types.ObjectId) {
    return this.responsesModel.findByIdAndDelete(id).exec();
  }
}
