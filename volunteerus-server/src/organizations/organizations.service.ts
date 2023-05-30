import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import mongoose, { Model } from 'mongoose';
import { Contact, ContactDocument } from '../contacts/schemas/contact.schema';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) 
    private organizationsModel : Model<OrganizationDocument>,
    @InjectModel(Contact.name) 
    private contactsModel: Model<ContactDocument>
  ) { }

  create(createOrganizationDto: CreateOrganizationDto) {
    return new this.organizationsModel(createOrganizationDto).save();
  }

  async addContactToOrganization(organizationId: mongoose.Types.ObjectId, contactData: any) {
    const organization = await this.organizationsModel.findById(organizationId).exec();
    if (!organization) {
      throw new HttpException('Organization not found', 404);
    }
    const contact = await this.contactsModel.create(contactData);
    organization.contact = contact;
    await organization.save();
    return organization;
  }

  findAll() {
    return this.organizationsModel.find().exec();
  }

  findOne(id: mongoose.Types.ObjectId) {
    return this.organizationsModel.findById(id).populate("contact").exec();
  }

  update(id: mongoose.Types.ObjectId, updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsModel.findByIdAndUpdate(id, updateOrganizationDto).exec();
  }

  remove(id: mongoose.Types.ObjectId) {
    return this.organizationsModel.findByIdAndDelete(id).exec();
  }
}