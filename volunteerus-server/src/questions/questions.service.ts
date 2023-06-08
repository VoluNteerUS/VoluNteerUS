import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class QuestionsService {
    constructor(@InjectModel(Question.name) private questionsModel: Model<QuestionDocument>) { }

  create(createQuestionDto: CreateQuestionDto) {
    return new this.questionsModel(createQuestionDto).save();
  }

  findAll() {
    return this.questionsModel.find().exec();
  }

  public async findOne(id: mongoose.Types.ObjectId): Promise<Question> {
    const question = await this.questionsModel.findById(id).exec();
    return question;
  }

  update(id: mongoose.Types.ObjectId, updateQuestionDto: UpdateQuestionDto) {
    return this.questionsModel.findByIdAndUpdate(id, updateQuestionDto).exec();
  }

  public async remove(id: mongoose.Types.ObjectId): Promise<Question> {
    const deletedQuestion = await this.questionsModel.findByIdAndDelete(id);
    return deletedQuestion;
  }
}
