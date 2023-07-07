import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event, EventSchema } from './schemas/event.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { FirebasestorageModule } from 'src/firebasestorage/firebasestorage.module';
import { Question, QuestionSchema } from 'src/questions/schemas/question.schema';
import { CaslModule } from 'src/casl/casl.module';
import { Response, ResponseSchema } from 'src/responses/schemas/response.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Response.name, schema: ResponseSchema },
      { name: User.name, schema: UserSchema },
    ]),
    FirebasestorageModule,
    CaslModule
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}