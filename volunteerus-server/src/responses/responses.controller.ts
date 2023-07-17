import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { Response } from './schemas/response.schema';
import mongoose from 'mongoose';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { Query } from '@nestjs/common';
import { PaginationResult } from '../types/pagination';

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
  
  @Get('/totalHours')
  getTotalHours(@Query('user_id') user_id: mongoose.Types.ObjectId): Promise<number> {
    return this.responsesService.getTotalHours(user_id);
  }

  @Get('/history')
  findPastAcceptedResponsesByUser(
    @Query('user_id') user_id: mongoose.Types.ObjectId,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<PaginationResult<Response>> {
    const parsedPage = parseInt(page.toString(), 10) || 1;
    const parsedLimit = parseInt(limit.toString(), 10) || 10;
    // Validate If parsedPage and parsedLimit is negative
    if (parsedPage < 0 || parsedLimit < 0) {
      throw new HttpException('Invalid page or limit', HttpStatus.BAD_REQUEST, {
        cause: new Error('Invalid page or limit'),
      });
    }
    return this.responsesService.getPastAcceptedResponsesByUser(user_id, parsedPage, parsedLimit);
  }

  @Get('/accepted')
  findAcceptedResponses(
    @Query('event_id') event_id: mongoose.Types.ObjectId,
    @Query('user_id') user_id: mongoose.Types.ObjectId,
    @Query('numberOfDays') numberOfDays: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<PaginationResult<Response>> {
    const parsedPage = parseInt(page.toString(), 10) || 1;
    const parsedLimit = parseInt(limit.toString(), 10) || 10;
    // Validate If parsedPage and parsedLimit is negative
    if (parsedPage < 0 || parsedLimit < 0) {
      throw new HttpException('Invalid page or limit', HttpStatus.BAD_REQUEST, {
        cause: new Error('Invalid page or limit'),
      });
    }
    if (event_id && numberOfDays) {
      return this.responsesService.getAcceptedResponsesByEventAndDate(event_id, numberOfDays, parsedPage, parsedLimit);
    } else if (event_id) {
      return this.responsesService.getAcceptedResponsesByEvent(event_id, parsedPage, parsedLimit);
    } else if (user_id) {
      return this.responsesService.getAcceptedResponsesByUser(user_id, parsedPage, parsedLimit);
    }
  }

  @Get('/pending')
  findPendingResponses(
    @Query('event_id') event_id: mongoose.Types.ObjectId,
    @Query('user_id') user_id: mongoose.Types.ObjectId,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<PaginationResult<Response>> {
    const parsedPage = parseInt(page.toString(), 10) || 1;
    const parsedLimit = parseInt(limit.toString(), 10) || 10;
    // Validate If parsedPage and parsedLimit is negative
    if (parsedPage < 0 || parsedLimit < 0) {
      throw new HttpException('Invalid page or limit', HttpStatus.BAD_REQUEST, {
        cause: new Error('Invalid page or limit'),
      });
    }
    if (event_id) {
      return this.responsesService.getPendingResponsesByEvent(event_id, parsedPage, parsedLimit);
    } else if (user_id) {
      return this.responsesService.getPendingResponsesByUser(user_id, parsedPage, parsedLimit);
    }
  }

  @Get('/rejected')
  findRejectedResponses(
    @Query('event_id') event_id: mongoose.Types.ObjectId,
    @Query('user_id') user_id: mongoose.Types.ObjectId,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<PaginationResult<Response>> {
    const parsedPage = parseInt(page.toString(), 10) || 1;
    const parsedLimit = parseInt(limit.toString(), 10) || 10;
    // Validate If parsedPage and parsedLimit is negative
    if (parsedPage < 0 || parsedLimit < 0) {
      throw new HttpException('Invalid page or limit', HttpStatus.BAD_REQUEST, {
        cause: new Error('Invalid page or limit'),
      });
    }
    if (event_id) {
      return this.responsesService.getRejectedResponsesByEvent(event_id, parsedPage, parsedLimit);
    } else if (user_id) {
      return this.responsesService.getRejectedResponsesByUser(user_id, parsedPage, parsedLimit);
    }
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

  @Patch()
  updateAll(@Query('role') role: string, @Body() updateResponseDto: UpdateResponseDto) {
    // Check if user has permission to update response
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('create', Response)) {
      return this.responsesService.updateAll(updateResponseDto);
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
