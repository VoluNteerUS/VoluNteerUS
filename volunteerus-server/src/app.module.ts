import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import * as fs from 'fs';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { FirebasestorageModule } from './firebasestorage/firebasestorage.module';
import { OrganizationsModule } from './organizations/organizations.module';
import * as dotenv from 'dotenv';
import { ContactsModule } from './contacts/contacts.module';
import { QuestionsModule } from './questions/questions.module';
import { ResponsesModule } from './responses/responses.module';

dotenv.config();
// const mongo_credentials = fs.readFileSync('./credentials/mongo_credentials.json', 'utf8');
// const mongo_credentials_json = JSON.parse(mongo_credentials);

@Module({
  imports: [
    // MongooseModule.forRoot(
    //   `mongodb+srv://${mongo_credentials_json["username"]}:${mongo_credentials_json["password"]}@${mongo_credentials_json["clusterURL"]}`,
    // ),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}