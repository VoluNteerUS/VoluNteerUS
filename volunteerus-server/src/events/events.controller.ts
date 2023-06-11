import { Body, Controller, Delete, Get, Patch, Post, Param, UploadedFile, UseInterceptors, Query, HttpException, HttpStatus } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';
import { UpdateEventDto } from './dto/update-event.dto';
import { FirebasestorageService } from '../firebasestorage/firebasestorage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { PaginationResult } from 'src/types/pagination';

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
    
    @Get()
    findAll(
      @Query('organization_id') organization_id: mongoose.Types.ObjectId,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10
    ): Promise<PaginationResult<Event>> {
      const parsedPage = parseInt(page.toString(), 10) || 1;
      const parsedLimit = parseInt(limit.toString(), 10) || 10;
      // Validate If parsedPage and parsedLimit is negative
      if (parsedPage < 0 || parsedLimit < 0) {
        throw new HttpException('Invalid page or limit', HttpStatus.BAD_REQUEST, {
          cause: new Error('Invalid page or limit'),
        });
      }
      if (organization_id) {
        return this.eventService.getEventsByOrganization(organization_id, parsedPage, parsedLimit);
      }
      return this.eventService.findAll(parsedPage, parsedLimit);
    }

    @Get('/upcoming')
    findUpcomingEvents(
      @Query('organization_id') organization_id: mongoose.Types.ObjectId,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10
    ): Promise<PaginationResult<Event>> {
      const parsedPage = parseInt(page.toString(), 10) || 1;
      const parsedLimit = parseInt(limit.toString(), 10) || 10;
      // Validate If parsedPage and parsedLimit is negative
      if (parsedPage < 0 || parsedLimit < 0) {
        throw new HttpException('Invalid page or limit', HttpStatus.BAD_REQUEST, {
          cause: new Error('Invalid page or limit'),
        });
      }
      if (organization_id) {
        return this.eventService.getUpcomingEventsByOrganization(organization_id, parsedPage, parsedLimit);
      }
      return this.eventService.findUpcomingEvents(parsedPage, parsedLimit);
    }

    @Get('/past')
    findPastEvents(
      @Query('organization_id') organization_id: mongoose.Types.ObjectId,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10
    ): Promise<PaginationResult<Event>> {
      const parsedPage = parseInt(page.toString(), 10) || 1;
      const parsedLimit = parseInt(limit.toString(), 10) || 10;
      // Validate If parsedPage and parsedLimit is negative
      if (parsedPage < 0 || parsedLimit < 0) {
        throw new HttpException('Invalid page or limit', HttpStatus.BAD_REQUEST, {
          cause: new Error('Invalid page or limit'),
        });
      }
      if (organization_id) {
        return this.eventService.getPastEventsByOrganization(organization_id, parsedPage, parsedLimit);
      }
      return this.eventService.findPastEvents(parsedPage, parsedLimit);
    }

    @Get(':id')
    findOne(@Param('id') id: mongoose.Types.ObjectId): Promise<Event> {
      return this.eventService.findOne(id);
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
