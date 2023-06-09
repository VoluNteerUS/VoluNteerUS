import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event, EventSchema } from './schemas/event.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { FirebasestorageModule } from 'src/firebasestorage/firebasestorage.module';
import { Question, QuestionSchema } from 'src/questions/schemas/question.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Question.name, schema: QuestionSchema }
    ]),
    FirebasestorageModule,
    CaslModule
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}