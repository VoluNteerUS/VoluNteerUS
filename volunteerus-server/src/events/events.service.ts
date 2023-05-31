import { Body, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import mongoose, { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventsModel: Model<EventDocument>) { }

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

  public async update(id: mongoose.Types.ObjectId, @Body() updateEventDto: UpdateEventDto): Promise<Event> {
    const editedEvent = await this.eventsModel.findByIdAndUpdate(id, updateEventDto);
    return editedEvent;
  }

  public async remove(id: mongoose.Types.ObjectId): Promise<Event> {
    const deletedEvent = await this.eventsModel.findByIdAndDelete(id);
    return deletedEvent;
  }
}