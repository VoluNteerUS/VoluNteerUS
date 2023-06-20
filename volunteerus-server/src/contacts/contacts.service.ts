import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) 
    private contactsModel: Model<ContactDocument>
  ) { }

  create(createContactDto: CreateContactDto) {
    return new this.contactsModel(createContactDto).save();
  }

  findAll() {
    return this.contactsModel.find().exec();
  }

  findOne(id: mongoose.Types.ObjectId) {
    return this.contactsModel.findById(id).exec();
  }

  update(id: mongoose.Types.ObjectId, updateContactDto: UpdateContactDto) {
    return this.contactsModel.findByIdAndUpdate(id, updateContactDto).exec();
  }

  remove(id: mongoose.Types.ObjectId) {
    return this.contactsModel.findByIdAndDelete(id).exec();
  }
}
