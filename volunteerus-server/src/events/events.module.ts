import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventSchema } from './schemas/event.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }])],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}