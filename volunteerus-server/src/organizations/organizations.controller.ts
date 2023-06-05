import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { FirebasestorageService } from 'src/firebasestorage/firebasestorage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import mongoose from 'mongoose';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly uploadService: FirebasestorageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() createOrganizationDto: CreateOrganizationDto, @UploadedFile() file: Express.Multer.File) {
    const destination = 'organizations';
    const organization = JSON.parse(createOrganizationDto["createOrganizationDto"]);
    console.log(organization);

    if (file) {
      const url = await this.uploadService.uploadFile(file, destination);
      // createOrganizationDto.image_url = url;
      organization.image_url = url;
    }
    // return this.organizationsService.create(createOrganizationDto);
    return this.organizationsService.create(organization);
  }

  @Post(':id/contacts')
  async addContactToOrganization(@Param('id') organizationId: mongoose.Types.ObjectId, @Body() contactData: any) {
    return this.organizationsService.addContactToOrganization(organizationId, contactData);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: mongoose.Types.ObjectId) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id') id: mongoose.Types.ObjectId, @Body() updateOrganizationDto: UpdateOrganizationDto, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      const destination = 'organizations';
      const url = await this.uploadService.uploadFile(file, destination);
      updateOrganizationDto.image_url = url;
    }
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Patch(':id/contacts')
  async updateContact(@Param('id') organizationId: mongoose.Types.ObjectId, @Body() contactData: any) {
    return this.organizationsService.updateContact(organizationId, contactData);
  }

  @Delete(':id')
  remove(@Param('id') id: mongoose.Types.ObjectId) {
    return this.organizationsService.remove(id);
  }
}
