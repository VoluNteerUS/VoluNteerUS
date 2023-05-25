import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from "@nestjs/mongoose";
import * as fs from 'fs';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';

const mongo_credentials = fs.readFileSync('./credentials/mongo_credentials.json', 'utf8');
const mongo_credentials_json = JSON.parse(mongo_credentials);

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${mongo_credentials_json["username"]}:${mongo_credentials_json["password"]}@${mongo_credentials_json["clusterURL"]}`,
    ),
    AuthModule,
    UsersModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}