import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CommitteeMembersService } from './committeemembers.service';
import { CreateCommitteeMemberDto } from './dto/create-committeemember.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committeemember.dto';
import mongoose from 'mongoose';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { CommitteeMember } from './schemas/committeemember.schema';

@Controller('committeeMembers')
export class CommitteeMembersController {
  constructor(
    private readonly committeemembersService: CommitteeMembersService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Post()
  create( 
    @Query("role") role: string,
    @Body() createCommitteeMemberDto: CreateCommitteeMemberDto
  ) {
    // Check if user has permission to create committee member for an organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('create', CommitteeMember)) {
      return this.committeemembersService.create(createCommitteeMemberDto);
    } else {
      throw new HttpException('Unauthorized to create committee members!', HttpStatus.FORBIDDEN);
    }
  }

  @Get()
  findAll(
    @Query("organization_id") organization_id: mongoose.Types.ObjectId,
    @Query("user_id") user_id: mongoose.Types.ObjectId
  ) {
    if (organization_id) {
      return this.committeemembersService.findAllByOrganizationId(organization_id);
    }
    if (user_id) {
      return this.committeemembersService.findAllByUserId(user_id);
    } else {
      return this.committeemembersService.findAll();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.committeemembersService.findOne(+id);
  }

  @Patch()
  updateMany(
    @Query("role") role: string,
    @Body() updateCommitteeMemberDto: UpdateCommitteeMemberDto
  ) {
    // Check if user has permission to update committee member for an organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('update', CommitteeMember)) {
      return this.committeemembersService.updateByOrganizationId(updateCommitteeMemberDto);
    } else {
      throw new HttpException('Unauthorized to update committee members!', HttpStatus.FORBIDDEN);
    }
  }

  @Patch(':id')
  update(
    @Query("role") role: string,
    @Param('id') id: string, 
    @Body() updateCommitteememberDto: UpdateCommitteeMemberDto
  ) {
    const ability = this.caslAbilityFactory.createForUser(role)
    if (ability.can('update', CommitteeMember)) {
      return this.committeemembersService.update(+id, updateCommitteememberDto);
    } else {
      throw new HttpException('Unauthorized to update committee members!', HttpStatus.FORBIDDEN);
    }
  }

  @Delete(':id')
  remove(@Query("role") role: string, @Param('id') id: string) {
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('delete', CommitteeMember)) {
      return this.committeemembersService.remove(+id);
    } else {
      throw new HttpException('Unauthorized to delete committee members!', HttpStatus.FORBIDDEN);
    }
  }
}
