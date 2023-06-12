import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommitteeMemberDto } from './dto/create-committeemember.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committeemember.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CommitteeMember, CommitteeMemberDocument } from './schemas/committeemember.schema';
import mongoose, { Model } from 'mongoose';
import { Organization, OrganizationDocument } from 'src/organizations/schemas/organization.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class CommitteeMembersService {

  constructor(
    @InjectModel(CommitteeMember.name) private committeeMemberModel: Model<CommitteeMemberDocument>,
    @InjectModel(Organization.name) private organizationModel: Model<OrganizationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async create(createCommitteeMemberDto: CreateCommitteeMemberDto) {
    // Check if user is already a committee member for the organization
    const organization = await this.organizationModel.findById(createCommitteeMemberDto.organization_id).exec();
    for (let i = 0; i < createCommitteeMemberDto.users.length; i++) {
      const user = await this.userModel.findById(createCommitteeMemberDto.users[i]).exec();
      const result = await this.committeeMemberModel.findOne({ user: createCommitteeMemberDto.users[i], organization: createCommitteeMemberDto.organization_id }).exec();
      if (!result) {
        const createdCommitteeMember = new this.committeeMemberModel({
          user: user,
          organization: organization
        });
        await createdCommitteeMember.save();
      }
    }
    return HttpStatus.CREATED;
  }

  findAll() {
    return this.committeeMemberModel.find().exec();
  }

  async findAllByOrganizationId(organizationId: mongoose.Types.ObjectId) {
    const committeeMembers = await this.committeeMemberModel.find({ organization: organizationId }).exec();
    // Return as array of users
    const user_ids = await committeeMembers.map(committeeMember => committeeMember.user);
    const result = await this.userModel.find({ _id: { $in: user_ids } }).exec();
    return result;
  }

  async findAllByUserId(userId: mongoose.Types.ObjectId) {
    const committeeMembers = await this.committeeMemberModel.find({ user: userId }).exec();
    // Return as array of organizations
    const organization_ids = await committeeMembers.map(committeeMember => committeeMember.organization);
    const result = await this.organizationModel.find({ _id: { $in: organization_ids } }).exec();
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} committeemember`;
  }

  update(id: number, updateCommitteeMemberDto: UpdateCommitteeMemberDto) {
    return `This action updates a #${id} committeemember`;
  }

  async updateByOrganizationId(updateCommitteeMemberDto: UpdateCommitteeMemberDto) {
    const committeeMembers = await this.committeeMemberModel.find({ organization: updateCommitteeMemberDto.organization_id }).exec();
    // Map to array of user ids
    const user_ids = await committeeMembers.map(committeeMember => committeeMember.user.toString());
    // Remove users that are no longer committee members
    const usersToRemove = user_ids.filter(user_id => !updateCommitteeMemberDto.users.includes(user_id));
    await this.committeeMemberModel.deleteMany({ user: { $in: usersToRemove }, organization: updateCommitteeMemberDto.organization_id }).exec();
    // Add users that are new committee members
    const usersToAdd = updateCommitteeMemberDto.users.filter(user_id => !user_ids.includes(user_id));
    await this.committeeMemberModel.insertMany(usersToAdd.map(user_id => ({ user: user_id, organization: updateCommitteeMemberDto.organization_id })));
    return HttpStatus.OK;
  }

  remove(id: number) {
    return `This action removes a #${id} committeemember`;
  }
}
