import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
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
    if (file) {
      const destination = 'organizations';
      const url = await this.uploadService.uploadFile(file, destination);
      createOrganizationDto.image_url = url;
    }
    return this.organizationsService.create(createOrganizationDto);
  }

  @Post(':id/contacts')
  async addContactToOrganization(@Param('id') organizationId: mongoose.Types.ObjectId, @Body() contactData: any) {
    return this.organizationsService.addContactToOrganization(organizationId, contactData);
  }


  @Get()
  findAll(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10
  ) {
    const parsedPage = parseInt(page.toString(), 10) || 1;
    const parsedLimit = parseInt(limit.toString(), 10) || 10;
    // Validate If parsedPage and parsedLimit is negative
    if (parsedPage < 0 || parsedLimit < 0) {
      throw new HttpException('Page and Limit must be positive', HttpStatus.BAD_REQUEST, {
        cause: new Error('Page and Limit must be positive'),
      });
    }
    return this.organizationsService.findAll(parsedPage, parsedLimit);
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
