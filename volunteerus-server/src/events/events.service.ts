import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import mongoose, { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationResult } from '../types/pagination';
import * as moment from 'moment';
import { HttpException } from '@nestjs/common';
import { Question, QuestionDocument } from '../questions/schemas/question.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventsModel: Model<EventDocument>,
    @InjectModel(Question.name) private questionsModel: Model<QuestionDocument>
  ){ }

  public async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = new this.eventsModel(createEventDto);
    return newEvent.save();
  }

  public async getCategories(): Promise<String[]> {
    return this.eventsModel.find().distinct('category').exec();
  }

  public async findOne(id: mongoose.Types.ObjectId): Promise<Event> {
    const event = await this.eventsModel.findById(id).exec();
    return event;
  }

  public async findAll(search: string, category: string, page: number, limit: number): Promise<PaginationResult<Event>> {
    const skip = (page - 1) * limit;
    if (category === 'All') {
      const [data, totalItems] = await Promise.all([
        this.eventsModel.find(
          { 
            title: { $regex: search, $options: 'i' },
          }).sort({ title: 1 })
          .populate('organized_by', 'name')
          .skip(skip).limit(limit).exec(),
        this.eventsModel.countDocuments({ title: { $regex: search, $options: 'i' }  }).exec()
      ]);
      const totalPages = Math.ceil(totalItems / limit);
      return new PaginationResult<Event>(data, page, totalItems, totalPages);
    } else {
      const [data, totalItems] = await Promise.all([
        this.eventsModel.find(
          {
            title: { $regex: search, $options: 'i' },
            category: category
          }).sort({ title: 1 })
          .populate('organized_by', 'name')
          .skip(skip).limit(limit).exec(),
        this.eventsModel.countDocuments({ title: { $regex: search, $options: 'i' }, category: category }).exec()
      ]);
      const totalPages = Math.ceil(totalItems / limit);
      return new PaginationResult<Event>(data, page, totalItems, totalPages);
    }
  }

  public async findLatestEvents(limit: number) {
    const data = await this.eventsModel.find()
      .sort({ signup_by: -1 })
      .populate('organized_by', 'name')
      .limit(limit).exec();
    return data;
  }

  public async findUpcomingEvents(page: number, limit: number): Promise<PaginationResult<Event>> {
    const skip = (page - 1) * limit;
    const data = await this.eventsModel.find({
      "date.0": {
        $gte: moment().format('YYYY-MM-DD')
      },
    }).populate('organized_by', 'name').skip(skip).limit(limit).exec();
    // Filter out events that are upcoming
    const upcomingEvents = data;
    // const upcomingEvents = data.filter(event => moment(`${event.date[0]} ${event.date[2]}`).isAfter(moment()));
    const totalItems = upcomingEvents.length;
    const totalPages = Math.ceil(totalItems / limit);
    return new PaginationResult<Event>(upcomingEvents, page, totalItems, totalPages);
  }

  public async findPastEvents(page: number, limit: number): Promise<PaginationResult<Event>> {
    const skip = (page - 1) * limit;
    const data = await this.eventsModel.find().populate('organized_by', 'name').skip(skip).limit(limit).exec();
    // Filter out events that are in the past
    const pastEvents = data.filter(event => moment(`${event.date[0]} ${event.date[2]}`).isBefore(moment()));
    const totalItems = pastEvents.length;
    const totalPages = Math.ceil(totalItems / limit);
    return new PaginationResult<Event>(pastEvents, page, totalItems, totalPages);
  }

  public async getEventsByOrganization(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Event>> {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.eventsModel.find({ organized_by: id }).populate('organized_by', 'name').skip(skip).limit(limit).exec(),
      this.eventsModel.countDocuments({ organized_by: id }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    return new PaginationResult<Event>(data, page, totalItems, totalPages);
  }

  public async getUpcomingEventsByOrganization(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Event>> {
    const skip = (page - 1) * limit;
    const upcomingEvents = await this.eventsModel.find({ 
      organized_by: id,
      "date.0": {
        $gte: moment().format('YYYY-MM-DD')
      },
    }).populate('organized_by', 'name').skip(skip).limit(limit).exec();
    // Filter out events that are upcoming
    // const upcomingEvents = data;
    // const upcomingEvents = data.filter(event => moment(`${event.date[0]} ${event.date[2]}`).isAfter(moment()));
    const totalItems = upcomingEvents.length;
    const totalPages = Math.ceil(totalItems / limit);
    return new PaginationResult<Event>(upcomingEvents, page, totalItems, totalPages);
  }

  public async getPastEventsByOrganization(id: mongoose.Types.ObjectId, page:number, limit: number): Promise<PaginationResult<Event>> {
    const skip = (page - 1) * limit;
    const pastEvents = await this.eventsModel.find({ 
      organized_by: id,
      "date.0": {
        $lt: moment().format('YYYY-MM-DD')
      }, 
    }).populate('organized_by', 'name').skip(skip).limit(limit).exec();
    // Filter out events that are in the past
    // const pastEvents = data.filter(event => moment(`${event.date[0]} ${event.date[2]}`).isBefore(moment()));
    const totalItems = pastEvents.length;
    const totalPages = Math.ceil(totalItems / limit);
    return new PaginationResult<Event>(pastEvents, page, totalItems, totalPages);
  }

  update(id: mongoose.Types.ObjectId, updateEventDto: UpdateEventDto) {
    return this.eventsModel.findByIdAndUpdate(id, updateEventDto).exec();
  }

  async updateQuestions(eventId: mongoose.Types.ObjectId, questionsData: any) {
    const event = await this.eventsModel.findById(eventId).exec();
    if (!event) {
      throw new HttpException('Event not found', 404);
    }
    const questions = await this.questionsModel.findByIdAndUpdate(event.questions, questionsData).exec();
    event.questions = questions;
    await event.save();
    return event;
  }

  public async remove(id: mongoose.Types.ObjectId): Promise<Event> {
    const deletedEvent = await this.eventsModel.findByIdAndDelete(id);
    return deletedEvent;
  }
}