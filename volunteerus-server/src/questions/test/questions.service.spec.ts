import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from '../questions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Question } from '../schemas/question.schema';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';

describe('QuestionsService', () => {
  let service: QuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService, {
          provide: getModelToken(Question.name),
          useValue: jest.fn(),
        },
        CaslAbilityFactory
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
