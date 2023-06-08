import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import mongoose, { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { HttpException } from '@nestjs/common';
import { Question, QuestionDocument } from 'src/questions/schemas/question.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventsModel: Model<EventDocument>,
    @InjectModel(Question.name) private questionsModel: Model<QuestionDocument>)
  { }

  public async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    const newEvent = new this.eventsModel(createEventDto);
    return newEvent.save();
  }

  public async findOne(id: mongoose.Types.ObjectId): Promise<Event> {
    const event = await this.eventsModel.findById(id).exec();
    return event;
  }

  public async findAll(): Promise<Event[]> {
    const events = await this.eventsModel.find().populate('organized_by', 'name').exec();
    return events;
  }

  public async getEventsByOrganization(id: mongoose.Types.ObjectId): Promise<Event[]> {
    const events = await this.eventsModel.find({ organized_by: id }).exec();
    return events;
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