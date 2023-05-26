import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventSchema } from './schemas/event.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { FirebasestorageModule } from 'src/firebasestorage/firebasestorage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    FirebasestorageModule
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}