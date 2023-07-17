import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { FirebasestorageModule } from './firebasestorage/firebasestorage.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ContactsModule } from './contacts/contacts.module';
import { QuestionsModule } from './questions/questions.module';
import { ResponsesModule } from './responses/responses.module';
import { CaslModule } from './casl/casl.module';
import { NotificationsModule } from './notifications/notifications.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER_URL}`,
    ),
    AuthModule,
    ContactsModule,
    EventsModule,
    FirebasestorageModule,
    OrganizationsModule,
    UsersModule,
    QuestionsModule,
    ResponsesModule,
    CaslModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}