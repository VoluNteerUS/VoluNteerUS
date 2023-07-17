import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { Response, ResponseSchema } from './schemas/response.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from '../casl/casl.module';
import { Notification, NotificationSchema } from '../notifications/schemas/notification.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { Event, EventSchema } from '../events/schemas/event.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Response.name, schema: ResponseSchema },
        { name: Event.name, schema: EventSchema },
        { name: Notification.name, schema: NotificationSchema },
        { name: User.name, schema: UserSchema },
      ]), 
      CaslModule,
    ],
    providers: [ResponsesService, NotificationsGateway],
    exports: [ResponsesService],
    controllers: [ResponsesController],
  })
  export class ResponsesModule {}
  