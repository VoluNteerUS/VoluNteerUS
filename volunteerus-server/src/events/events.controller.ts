import { Body, Controller, Delete, Get, Patch, Post, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';
import { UpdateEventDto } from './dto/update-event.dto';
import { FirebasestorageService } from '../firebasestorage/firebasestorage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('events')
export class EventsController {
    constructor(
      private readonly eventService: EventsService,
      private readonly uploadService: FirebasestorageService,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() createEventDto: CreateEventDto, @UploadedFile() file: Express.Multer.File): Promise<Event> {
      const destination = 'events';
      if (file) {
        console.log(file.filename);
        const url = await this.uploadService.uploadFile(file, destination);
        createEventDto.image_url = url;
      }
      return this.eventService.create(createEventDto);
    }
    
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Event> {
      return this.eventService.findOne(+id);
    }
    
    @Get()
    findAll(): Promise<Event[]> {
      return this.eventService.findAll();
    }
    
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<Event> {
      return this.eventService.update(+id, updateEventDto);
    }
    
    @Delete(':id')
    remove(@Param('id') id: string): Promise<Event> {
      return this.eventService.remove(+id);
    }
}
