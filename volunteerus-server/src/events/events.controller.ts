import { Body, Controller, Delete, Get, Patch, Post, Param, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';
import { UpdateEventDto } from './dto/update-event.dto';
import { FirebasestorageService } from '../firebasestorage/firebasestorage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';

@Controller('events')
export class EventsController {
    constructor(
      private readonly eventService: EventsService,
      private readonly uploadService: FirebasestorageService,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() createEventDto: CreateEventDto, @UploadedFile() file: Express.Multer.File): Promise<Event> {
      // console.log(createEventDto);
      // Convert createEventDto to json
      // console.log(event);

      const event = JSON.parse(JSON.stringify(createEventDto));

      const destination = 'events';
      if (file) {
        const url = await this.uploadService.uploadFile(file, destination);
        // createEventDto.image_url = url;
        event.image_url = url;
      }
      // Find organization by name
      // const organization = await this.organizationService.findOne(createEventDto.organized_by);
      // createEventDto.organized_by = organization;
      // Update event's organizer
      // return this.eventService.create(createEventDto);

      // split the string into individual array elements
      event.date = event.date.split(',');
      event.category = event.category.split(',');
      event.questions = event.questions.split(',');

      return this.eventService.create(event);
    }
    
    @Get(':id')
    findOne(@Param('id') id: mongoose.Types.ObjectId): Promise<Event> {
      return this.eventService.findOne(id);
    }
    
    @Get()
    findAll(@Query('organization_id') organization_id: mongoose.Types.ObjectId): Promise<Event[]> {
      if (organization_id) {
        return this.eventService.getEventsByOrganization(organization_id);
      }
      return this.eventService.findAll();
    }
    
    @Patch(':id')
    update(@Param('id') id: mongoose.Types.ObjectId, @Body() updateEventDto: UpdateEventDto): Promise<Event> {
      return this.eventService.update(id, updateEventDto);
    }
    
    @Delete(':id')
    remove(@Param('id') id: mongoose.Types.ObjectId): Promise<Event> {
      return this.eventService.remove(id);
    }
}
