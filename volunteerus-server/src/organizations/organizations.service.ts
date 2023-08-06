import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import mongoose, { Model } from 'mongoose';
import { Contact, ContactDocument } from '../contacts/schemas/contact.schema';
import { PaginationResult } from '../types/pagination';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CheckCommitteeMemberDto } from './dto/check-committee-member.dto';
import { GetUserOrganizationsDto } from './dto/get-user-organizations';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) 
    private organizationsModel : Model<OrganizationDocument>,
    @InjectModel(Contact.name) 
    private contactsModel: Model<ContactDocument>,
    @InjectModel(User.name)
    private usersModel: Model<UserDocument>
  ) { }

  async create(createOrganizationDto: CreateOrganizationDto) {
    // Check if an organization with the same name exists)
    const existingOrganization = await this.organizationsModel.findOne({ name: createOrganizationDto.name }).exec();
    if (existingOrganization) {
      throw new HttpException('Organization with the same name already exists', HttpStatus.BAD_REQUEST, {
        cause: new Error('Organization with the same name already exists'),
      });
    } else {
      return new this.organizationsModel(createOrganizationDto).save();
    }
  }

  async checkCommitteeMember(data: CheckCommitteeMemberDto) : Promise<boolean> {
    const organization = await this.organizationsModel.findById(data.organizationId).exec();
    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND, {
        cause: new Error('Organization not found'),
      });
    }
    const user = await this.usersModel.findById(data.userId).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND, {
        cause: new Error('User not found'),
      });
    }
    return organization.committee_members.includes(user._id);
  }

  async getUserOrganizations(data: GetUserOrganizationsDto) : Promise<Organization[]> {
    const organizations = await this.organizationsModel.find().exec();
    if (!organizations) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND, {
        cause: new Error('Organization not found'),
      });
    }
    const user = await this.usersModel.findById(new mongoose.Types.ObjectId(data.userId)).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND, {
        cause: new Error('User not found'),
      });
    }
    return organizations.filter((organization) => organization.committee_members.includes(user._id));
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

  async addCommitteeMembersToOrganization(organizationId: mongoose.Types.ObjectId, users: string[]) {
    // Check if organization exists
    const organization = await this.organizationsModel.findById(organizationId).exec();
    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND, {
        cause: new Error('Organization not found'),
      });
    }
    // Check if user exists
    for (var i = 0; i < users.length; i++) {
      const userId = users[i];
      const user = await this.usersModel.findById(userId).exec();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND, {
          cause: new Error('User not found'),
        });
      }
      // Check if user is already in organization
      if (organization.committee_members.includes(user._id)) {
        throw new HttpException('User is already in organization', HttpStatus.BAD_REQUEST, {
          cause: new Error('User is already in organization'),
        });
      }
      // Add user to organization
      organization.committee_members.push(user._id);
    }
    // Save organization
    await organization.save();
    return organization;
  }

  async count() {
    return this.organizationsModel.countDocuments().exec();
  }

  async findAll(page: number, limit: number, query: string, sort: string) {
    const skip = (page - 1) * limit;
    if (sort === "DESC") {
      const [data, totalItems] = await Promise.all([
        this.organizationsModel.find({ name: { $regex: query, $options: 'i' } }).sort({ name: -1 }).skip(skip).limit(limit).exec(),
        this.organizationsModel.countDocuments({ name: { $regex: query, $options: 'i' } }).exec()
      ]);
      const totalPages = Math.ceil(totalItems / limit);
      return new PaginationResult<Organization>(data, page, totalItems, totalPages);
    } else {
      const [data, totalItems] = await Promise.all([
        this.organizationsModel.find({ name: { $regex: query, $options: 'i' } }).sort({ name: 1 }).skip(skip).limit(limit).exec(),
        this.organizationsModel.countDocuments({ name: { $regex: query, $options: 'i' } }).exec()
      ]);
      const totalPages = Math.ceil(totalItems / limit);
      return new PaginationResult<Organization>(data, page, totalItems, totalPages);
    }
  }

  findOne(id: mongoose.Types.ObjectId) {
    return this.organizationsModel
      .findById(id)
      .populate("contact")
      .populate("committee_members", "-password -registered_on -role -__v")
      .exec();
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

  async updateCommitteeMembers(organizationId: mongoose.Types.ObjectId, users: string[]) {
    const organization = await this.organizationsModel.findById(organizationId).exec();
    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND, {
        cause: new Error('Organization not found'),
      });
    }
    // Compare the current committee members with the new ones and remove the ones that are not in the new list
    console.log("Organization: ", organization.name);
    const currentCommitteeMembers = organization.committee_members.map(member => member.toString());
    const newCommitteeMembers = users.length > 0 ? users.map(member => member.toString()) : [];
    const membersToRemove = currentCommitteeMembers.filter(member => !newCommitteeMembers.includes(member));
    console.log("Users: ", users);
    console.log("Current Comm: ", currentCommitteeMembers);
    console.log("New Comm: ", newCommitteeMembers);
    console.log("To Remove: ", membersToRemove);
    for (const member of membersToRemove) {
      const user = await this.usersModel.findById(member).exec();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND, {
          cause: new Error('User not found'),
        });
      }
      organization.committee_members = organization.committee_members.filter(member => member.toString() !== user._id.toString());
    }
    // Add the new committee members
    const membersToAdd = newCommitteeMembers.filter(member => !currentCommitteeMembers.includes(member));
    for (const member of membersToAdd) {
      const user = await this.usersModel.findById(member).exec();
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND, {
          cause: new Error('User not found'),
        });
      }
      organization.committee_members.push(user);
    }
    await organization.save();
    return organization;
  }

  remove(id: mongoose.Types.ObjectId) {
    return this.organizationsModel.findByIdAndDelete(id).exec();
  }
}