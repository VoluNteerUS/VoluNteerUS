import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { Response } from './schemas/response.schema';
import mongoose from 'mongoose';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Query } from '@nestjs/common';

@Controller('responses')
export class ResponsesController {
  constructor(
    private readonly responsesService: ResponsesService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Post()
  create(@Query('role') role: string, @Body() createResponseDto: CreateResponseDto): Promise<Response> {
    // Check if user has permission to create a response
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('create', Response)) {
      return this.responsesService.create(createResponseDto);
    }
  }

  @Get()
  findAll(@Query('user_id') user_id: mongoose.Types.ObjectId, @Query('event_id') event_id: mongoose.Types.ObjectId): Promise<Response[]> {
    if (user_id) {
      return this.responsesService.getResponsesByUser(user_id);
    } else if (event_id) {
      return this.responsesService.getResponsesByEvent(event_id);
    }
    return this.responsesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: mongoose.Types.ObjectId): Promise<Response> {
    return this.responsesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: mongoose.Types.ObjectId, @Query('role') role: string, @Body() updateResponseDto: UpdateResponseDto) {
    // Check if user has permission to create an organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('create', Response)) {
      return this.responsesService.update(id, updateResponseDto);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: mongoose.Types.ObjectId, @Query('role') role: string) {
    // Check if user has permission to create an organization
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('create', Response)) {
      return this.responsesService.remove(id);
    }
  }
}
