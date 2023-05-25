import { Body, Controller, Delete, Get, Patch, Post, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventService: EventsService) { }

    @Post()
    create(@Body() createEventDto: CreateEventDto): Promise<Event> {
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
