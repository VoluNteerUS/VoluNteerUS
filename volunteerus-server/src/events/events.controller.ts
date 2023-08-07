import { Body, Controller, Delete, Get, Patch, Post, Param, UploadedFile, UseInterceptors, Query, HttpException, HttpStatus } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';
import { UpdateEventDto } from './dto/update-event.dto';
import { FirebasestorageService } from '../firebasestorage/firebasestorage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { PaginationResult } from '../types/pagination';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { CreateGroupingDto } from './dto/create-grouping.dto';

@Controller('events')
export class EventsController {
    constructor(
      private readonly eventService: EventsService,
      private readonly uploadService: FirebasestorageService,
      private caslAbilityFactory: CaslAbilityFactory
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Query('role') role: string, @Body() createEventDto: CreateEventDto, @UploadedFile() file: Express.Multer.File): Promise<Event> {
      // console.log(createEventDto);
      // Convert createEventDto to json
      // console.log(event);

      // check if user has permission to create Event
      const ability = this.caslAbilityFactory.createForUser(role);
      if (ability.can('create', Event)) {
  
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
        if (typeof event.date === "string") {
          event.date = event.date.split(',');
        }
        if (typeof event.category === "string") {
          event.category = event.category.split(',');
        }
        if (typeof event.groupSettings === "string") {
          event.groupSettings = event.groupSettings.split(',');
        }
        if (typeof event.defaultHours === "string") {
          event.defaultHours = event.defaultHours.split(',');
          event.defaultHours = event.defaultHours.map((hours) => parseFloat(hours));
        }

        return this.eventService.create(event);
      } 
    }

    @Post('/groupings/create')
    async createGroupings(@Query('role') role: string, @Body() createGroupingsDto: CreateGroupingDto) {
      const ability = this.caslAbilityFactory.createForUser(role);
      if (ability.can('create', Event)) {
        return this.eventService.createGroupings(createGroupingsDto);
      }
    }
    
    @Get()
    findAll(
      @Query('organization_id') organization_id?: mongoose.Types.ObjectId,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('search') search: string = '',
      @Query('category') category: string = 'All'
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
      return this.eventService.findAll(search, category, parsedPage, parsedLimit);
    }

    @Get('count')
    count() {
      return this.eventService.count();
    }

    @Get('/categories')
    getCategories() {
      return this.eventService.getCategories();
    }

    @Get('/latest')
    findLatestEvents(@Query('limit') limit: number = 10) {
      return this.eventService.findLatestEvents(limit);
    }

    @Get('/upcoming')
    findUpcomingEvents(
      @Query('organization_id') organization_id: mongoose.Types.ObjectId,
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('search') search: string = '',
      @Query('categories') categories: string = ''
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
      let parsedCategories = (categories === '') ? [] : categories.split(',');
      // console.log(parsedCategories);
      // console.log(parsedCategories.length);
      return this.eventService.findUpcomingEvents(search, parsedCategories, parsedPage, parsedLimit);
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

    @Get('/signUpCount')
    getSignUpCount(
      @Query('date') date: Date
    ): Promise<number> {
      return this.eventService.getEventSignUpCount(date);
    }

    @Get(':id')
    findOne(@Param('id') id: mongoose.Types.ObjectId): Promise<Event> {
      return this.eventService.findOne(id);
    }
    
    @Patch(':id')
    @UseInterceptors(FileInterceptor('file'))
    async update(@Param('id') id: mongoose.Types.ObjectId, @Query('role') role: string, @Body() updateEventDto: UpdateEventDto, @UploadedFile() file: Express.Multer.File) {
      // check if user has permission to update event
      const ability = this.caslAbilityFactory.createForUser(role);
      if (ability.can('update', Event)) {

        const event = JSON.parse(JSON.stringify(updateEventDto));

        if (file) {
          const destination = 'events';
          const url = await this.uploadService.uploadFile(file, destination);
          event.image_url = url;
        }
        if (typeof event.date === "string") {
          event.date = event.date.split(',');
        }
        if (typeof event.category === "string") {
          event.category = event.category.split(',');
        }
        if (typeof event.groupSettings === "string") {
          event.groupSettings = event.groupSettings.split(',');
        }
        if (typeof event.defaultHours === "string") {
          event.defaultHours = event.defaultHours.split(',');
          event.defaultHours = event.defaultHours.map((hours) => parseFloat(hours));
        }

        return this.eventService.update(id, event);
      }
    }

    @Patch(':id/questions')
    async updateQuestions(@Param('id') eventId: mongoose.Types.ObjectId, @Query('role') role: string, @Body() questionsData: any) {
      // check if user has permission to update event
      const ability = this.caslAbilityFactory.createForUser(role);
      if (ability.can('update', Event)) {
        return this.eventService.updateQuestions(eventId, questionsData);
      }
    }
    
    @Delete(':id')
    remove(@Param('id') id: mongoose.Types.ObjectId, @Query('role') role: string,): Promise<Event> {
      // check if user has permission to delete an event
      const ability = this.caslAbilityFactory.createForUser(role);
      if (ability.can('delete', Event)) {
        return this.eventService.remove(id);
      }
    }
}
