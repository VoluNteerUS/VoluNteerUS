import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema}]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
})

export class ContactsModule {}