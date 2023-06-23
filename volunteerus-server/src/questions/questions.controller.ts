import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './schemas/question.schema';
import mongoose from 'mongoose';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';


@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  @Post()
  create(@Query('role') role: string, @Body() createQuestionDto: CreateQuestionDto): Promise<Question> {
    // Check if user has permission to create event details / sign up form
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('create', Question)) {
      return this.questionsService.create(createQuestionDto);
    } 
  }

  @Get()
  findAll() {
    return this.questionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: mongoose.Types.ObjectId): Promise<Question> {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: mongoose.Types.ObjectId, @Query('role') role: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    // Check if user has permission to update event details / sign up form
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('update', Question)) {
      return this.questionsService.update(id, updateQuestionDto);
    }
  }

  @Delete(':id')
  remove(@Query('role') role: string, @Param('id') id: mongoose.Types.ObjectId): Promise<Question> {
    // Check if user has permission to delete event details / sign up form
    const ability = this.caslAbilityFactory.createForUser(role);
    if (ability.can('delete', Question)) {
      return this.questionsService.remove(id);
    }
  }

}
