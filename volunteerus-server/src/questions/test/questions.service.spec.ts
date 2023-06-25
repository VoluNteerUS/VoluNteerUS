import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from '../questions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Question, QuestionDocument } from '../schemas/question.schema';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';
import mongoose, { Model } from 'mongoose';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { questionStub } from './stubs/question.stub';
import { UpdateQuestionDto } from '../dto/update-question.dto';

jest.mock('../questions.service');

describe('QuestionsService', () => {
  let service: QuestionsService;
  let questionModel: Model<QuestionDocument>;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        QuestionsService, {
          provide: getModelToken(Question.name),
          useValue: jest.fn(),
        },
        CaslAbilityFactory
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    questionModel = module.get<Model<QuestionDocument>>(getModelToken(Question.name));
    jest.clearAllMocks();
  });

  describe('createQuestion', () => {
    describe('when create is called', () => {
      let question: Question;
      let newQuestion: CreateQuestionDto;

      beforeEach(async () => {
        jest.spyOn(service, 'create');
        newQuestion = {
          1: ["Test Question 1", "Open Ended"],
          2: ["Test Question 2", "MCQ"],
          3: ["Test Question 3", "MCQ"],
          4: ["Test Question 4", "MCQ"],
          5: ["Test Question 5", "MCQ"],
          6: ["Test Question 6", "MCQ"],
        }
        question = await service.create(newQuestion);
      })

      test('then it should call questionsService', () => {
        expect(service.create).toHaveBeenCalledWith(newQuestion);
      })

      test('then it should return a question', () => {
        expect(question).toEqual(questionStub());
      })
    })
  })

  describe('updateQuestion', () => {
    describe('when update is called', () => {
      let question: Question;
      let updateQuestionDto: UpdateQuestionDto;
      const questionId = new mongoose.Types.ObjectId("645fac0625f4bbf51f8f42e1");

      beforeEach(async () => {
        jest.spyOn(service, 'update');
        updateQuestionDto = {
          1: ["Test Question 1", "Open Ended"],
          2: ["Test Question 2", "MCQ"],
          3: ["Test Question 3", "MCQ"],
          4: ["Test Question 4", "MCQ"],
          5: ["Test Question 5", "MCQ"],
          6: [],
        }
        question = await service.update(questionId, updateQuestionDto);
      })

      test('then it should call questionsService', () => {
        expect(service.update).toHaveBeenCalledWith(questionId, updateQuestionDto);
      })

      test('then it should return a question', () => {
        expect(question).toEqual({ ...questionStub(), 6: [] });
      })
    })
  })

  describe('findOne', () => {
    describe('When findOne is called', () => {
      let question: Question;
      const questionId = new mongoose.Types.ObjectId("645fac0625f4bbf51f8f42e1")

      beforeEach(async () => {
        jest.spyOn(service, 'findOne');
        question = await service.findOne(questionId)
      })

      test('then it should call questionsService', () => {
        expect(service.findOne).toBeCalledWith(questionId)
      })

      test('then it should return a question', () => {
        expect(question).toEqual(questionStub());
      })
    })
  })

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let questions: Question[];

      beforeEach(async () => {
        jest.spyOn(service, 'findAll');
        questions = await service.findAll();
      })

      test('then it should call questionsService', () => {
        expect(service.findAll).toHaveBeenCalled();
      })

      test('then it should return a list of questions', () => {
        expect(questions).toEqual([questionStub()]);
      })
    })
  })

  describe('remove', () => {
    describe('When remove is called', () => {
      let question: Question;
      const questionId = new mongoose.Types.ObjectId("645fac0625f4bbf51f8f42e1")

      beforeEach(async () => {
        jest.spyOn(service, 'remove');
        question = await service.remove(questionId)
      })

      test('then it should call questionsService', () => {
        expect(service.remove).toBeCalledWith(questionId)
      })

      test('then it should return a question', () => {
        expect(question).toEqual(questionStub());
      })
    })
  })
});
