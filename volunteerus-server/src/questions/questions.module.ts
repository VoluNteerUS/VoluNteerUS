import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question, QuestionSchema } from './schemas/question.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from 'src/casl/casl.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]), CaslModule],
    providers: [QuestionsService],
    exports: [QuestionsService],
    controllers: [QuestionsController],
  })
  export class QuestionsModule {}
  