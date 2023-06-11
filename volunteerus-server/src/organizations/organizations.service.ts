import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import mongoose, { Model } from 'mongoose';
import { Contact, ContactDocument } from '../contacts/schemas/contact.schema';
import { PaginationResult } from 'src/types/pagination';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) 
    private organizationsModel : Model<OrganizationDocument>,
    @InjectModel(Contact.name) 
    private contactsModel: Model<ContactDocument>
  ) { }

  async create(createOrganizationDto: CreateOrganizationDto) {
    // Check if an organization with the same name exists
    const existingOrganization = await this.organizationsModel.findOne({ name: createOrganizationDto.name }).exec();
    if (existingOrganization) {
      throw new HttpException('Organization with the same name already exists', HttpStatus.BAD_REQUEST, {
        cause: new Error('Organization with the same name already exists'),
      });
    } else {
      return new this.organizationsModel(createOrganizationDto).save();
    }
  }

  async addContactToOrganization(organizationId: mongoose.Types.ObjectId, contactData: any) {
    // Check if organization exists
    const organization = await this.organizationsModel.findById(organizationId).exec();
    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND, {
        cause: new Error('Organization not found'),
      });
    }
    // Create contact information
    const contact = await this.contactsModel.create(contactData);
    // Set contact information to organization
    organization.contact = contact;
    // Save organization
    await organization.save();
    return organization;
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.organizationsModel.find().skip(skip).limit(limit).exec(), 
      this.organizationsModel.countDocuments().exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    return new PaginationResult<Organization>(data, totalItems, totalPages);
  }

  async search(page: number, limit: number, query: string) {
    const skip = (page - 1) * limit;
    const [data, totalItems] = await Promise.all([
      this.organizationsModel.find({ name: { $regex: query, $options: 'i' } }).skip(skip).limit(limit).exec(),
      this.organizationsModel.countDocuments({ name: { $regex: query, $options: 'i' } }).exec()
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    return new PaginationResult<Organization>(data, totalItems, totalPages);
  }

  findOne(id: mongoose.Types.ObjectId) {
    return this.organizationsModel.findById(id).populate("contact").exec();
  }

  update(id: mongoose.Types.ObjectId, updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsModel.findByIdAndUpdate(id, updateOrganizationDto).exec();
  }

  async updateContact(organizationId: mongoose.Types.ObjectId, contactData: any) {
    const organization = await this.organizationsModel.findById(organizationId).exec();
    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND, {
        cause: new Error('Organization not found'),
      });
    }
    const contact = await this.contactsModel.findByIdAndUpdate(organization.contact, contactData).exec();
    organization.contact = contact;
    await organization.save();
    return organization;
  }

  remove(id: mongoose.Types.ObjectId) {
    return this.organizationsModel.findByIdAndDelete(id).exec();
  }
}