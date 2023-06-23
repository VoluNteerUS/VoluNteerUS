import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Question } from './schemas/question.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';

describe('QuestionsController', () => {
  let controller: QuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        QuestionsService, 
        {
          provide: getModelToken(Question.name),
          useValue: jest.fn(),
        }, 
        CaslAbilityFactory
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
