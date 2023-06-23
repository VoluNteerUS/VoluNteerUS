import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import mongoose from 'mongoose';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { Query } from '@nestjs/common';
import { Contact } from './schemas/contact.schema';

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Post()
  create(@Query('role') role: string, @Body() createContactDto: CreateContactDto) {
    // Check if user has permission to create contact for an organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('create', Contact)) {
      return this.contactsService.create(createContactDto);
    }
  }

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: mongoose.Types.ObjectId) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: mongoose.Types.ObjectId, @Query('role') role: string, @Body() updateContactDto: UpdateContactDto) {
    // Check if user has permission to update contact for an organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('update', Contact)) {
      return this.contactsService.update(id, updateContactDto);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: mongoose.Types.ObjectId, @Query('role') role: string) {
    // Check if user has permission to delete contact for an organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('delete', Contact)) {
      return this.contactsService.remove(id);
    }
  }
}
