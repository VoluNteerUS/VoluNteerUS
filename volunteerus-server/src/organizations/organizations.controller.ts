import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query, HttpException, HttpStatus } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { FirebasestorageService } from '../firebasestorage/firebasestorage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { Organization } from './schemas/organization.schema';
import { CheckCommitteeMemberDto } from './dto/check-committee-member.dto';
import { GetUserOrganizationsDto } from './dto/get-user-organizations';
import { CommitteeMemberDataDto } from './dto/committee-member-data.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly uploadService: FirebasestorageService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Query('role') role: string, @Body() createOrganizationDto: CreateOrganizationDto, @UploadedFile() file: Express.Multer.File) {
    // Check if user has permission to create an organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('create', Organization)) {
      const destination = 'organizations';
      if (file) {
        // Check if file is an image
        if (!file.mimetype.includes('image')) {
          throw new HttpException('File must be an image', HttpStatus.BAD_REQUEST, {
            cause: new Error('File must be an image'),
          });
        }
        // Check if file size is greater than 10MB
        if (file.size > 5 * 1024 * 1024) {
          throw new HttpException('File size must be less than 10MB', HttpStatus.BAD_REQUEST, {
            cause: new Error('File size must be less than 10MB'),
          });
        }

        const url = await this.uploadService.uploadFile(file, destination);
        createOrganizationDto.image_url = url;
      }
      return this.organizationsService.create(createOrganizationDto);
    } else {
      throw new HttpException('Unauthorized Action', HttpStatus.FORBIDDEN);
    }
  }
  
  @Post('checkCommitteeMember')
  async checkCommitteeMember(@Body() data: CheckCommitteeMemberDto) {
    return this.organizationsService.checkCommitteeMember(data);
  }

  @Post('getUserOrganizations')
  async getUserOrganizations(@Body() data: GetUserOrganizationsDto) {
    return this.organizationsService.getUserOrganizations(data);
  }

  @Post(':id/contacts')
  async addContactToOrganization(@Param('id') organizationId: mongoose.Types.ObjectId, @Query('role') role: string, @Body() contactData: any) {
    // Check if user has permission to create contact for an organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('create', Organization)) {
      return this.organizationsService.addContactToOrganization(organizationId, contactData);
    } else {
      throw new HttpException('Unauthorized Action', HttpStatus.FORBIDDEN);
    }
  }

  @Post(':id/committeeMembers')
  async addCommitteeMembersToOrganization(
    @Param('id') organizationId: mongoose.Types.ObjectId, 
    @Body() committeeMemberData: CommitteeMemberDataDto, 
    @Query('role') role: string
  ) {
    // Check if user has permission to create committee member for an organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('create', Organization)) {
      return this.organizationsService.addCommitteeMembersToOrganization(organizationId, committeeMemberData.committee_members);
    } else {
      throw new HttpException('Unauthorized Action', HttpStatus.FORBIDDEN);
    }
  }

  @Get()
  findAll(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('sort') sort: string = 'ASC'
  ) {
    const parsedPage = parseInt(page.toString(), 10) || 1;
    const parsedLimit = parseInt(limit.toString(), 10) || 10;
    // Validate If parsedPage and parsedLimit is negative
    if (parsedPage < 0 || parsedLimit < 0) {
      throw new HttpException('Page and Limit must be positive', HttpStatus.BAD_REQUEST, {
        cause: new Error('Page and Limit must be positive'),
      });
    }
    return this.organizationsService.findAll(parsedPage, parsedLimit, search, sort);
  }

  @Get('count')
  count() {
    return this.organizationsService.count();
  }

  @Get(':id')
  findOne(@Param('id') id: mongoose.Types.ObjectId) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id') id: mongoose.Types.ObjectId, @Query('role') role: string, @Body() updateOrganizationDto: UpdateOrganizationDto, @UploadedFile() file: Express.Multer.File) {
    // Check if user has permission to update Organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('update', Organization)) {
      if (file) {
        // Check if file is an image
        if (!file.mimetype.includes('image')) {
          throw new HttpException('File must be an image', HttpStatus.BAD_REQUEST, {
            cause: new Error('File must be an image'),
          });
        }
        // Check if file size is greater than 10MB
        if (file.size > 5 * 1024 * 1024) {
          throw new HttpException('File size must be less than 5MB', HttpStatus.BAD_REQUEST, {
            cause: new Error('File size must be less than 5MB'),
          });
        }
        const destination = 'organizations';
        const url = await this.uploadService.uploadFile(file, destination);
        updateOrganizationDto.image_url = url;
      }
      return this.organizationsService.update(id, updateOrganizationDto);
    }
  }

  @Patch(':id/contacts')
  async updateContact(@Param('id') organizationId: mongoose.Types.ObjectId, @Query('role') role: string, @Body() contactData: any) {
    // Check if user has permission to update contact for an Organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('update', Organization)) {
      return this.organizationsService.updateContact(organizationId, contactData);
    }
  }

  @Patch(':id/committeeMembers')
  async updateCommitteeMembers(@Param('id') organizationId: mongoose.Types.ObjectId, @Query('role') role: string, @Body() committeeMemberData: CommitteeMemberDataDto) {
    // Check if user has permission to update committee member for an Organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('update', Organization)) {
      return this.organizationsService.updateCommitteeMembers(organizationId, committeeMemberData.committee_members);
    } else {
      throw new HttpException('Unauthorized Action', HttpStatus.FORBIDDEN);
    }
  }


  @Delete(':id')
  remove(@Param('id') id: mongoose.Types.ObjectId, @Query('role') role: string) {
    // Check if user has permission to delete an Organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('delete', Organization)) {
      return this.organizationsService.remove(id);
    } else {
      throw new HttpException('Unauthorized Action', HttpStatus.FORBIDDEN);
    }
  }
}
