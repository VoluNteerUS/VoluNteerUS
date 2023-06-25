import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from '../questions.controller';
import { QuestionsService } from '../questions.service';
import { Question } from '../schemas/question.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';
import mongoose from 'mongoose';
import { questionStub, updatedQuestionStub } from './stubs/question.stub';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { UpdateQuestionDto } from '../dto/update-question.dto';

jest.mock('../questions.service');

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let questionsService: QuestionsService;

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
    questionsService = module.get<QuestionsService>(QuestionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(questionsService).toBeDefined();
  });

  describe('findOne', () => {
    describe('When findOne is called', () => {
      let question: Question;
      const questionId = new mongoose.Types.ObjectId("645fac0625f4bbf51f8f42e1")

      beforeEach(async () => {
        question = await controller.findOne(questionId)
      })

      test('then it should call questionsService', () => {
        expect(questionsService.findOne).toBeCalledWith(questionId)
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
        questions = await controller.findAll();
      })

      test('then it should call questionsService', () => {
        expect(questionsService.findAll).toHaveBeenCalled();
      })

      test('then it should return questions', () => {
        expect(questions).toEqual([questionStub()]);
      })
    })
  })

  describe('createQuestion', () => {
    describe('when create is called', () => {
      let question: Question;
      let createQuestionDto: CreateQuestionDto;

      beforeEach(async () => {
        createQuestionDto = {
          1: ["Test Question 1", "Open Ended"],
          2: ["Test Question 2", "MCQ"],
          3: ["Test Question 3", "MCQ"],
          4: ["Test Question 4", "MCQ"],
          5: ["Test Question 5", "MCQ"],
          6: ["Test Question 6", "MCQ"],
        }
        question = await controller.create("COMMITTEE MEMBER", createQuestionDto);
      })

      test('then it should call questionsService', () => {
        expect(questionsService.create).toHaveBeenCalledWith(createQuestionDto);
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
        updateQuestionDto = {
          1: ["Test Question 1", "Open Ended"],
          2: ["Test Question 2", "MCQ"],
          3: ["Test Question 3", "MCQ"],
          4: ["Test Question 4", "MCQ"],
          5: ["Test Question 5", "MCQ"],
          6: [],
        }
        question = await controller.update(questionId, "COMMITTEE MEMBER", updateQuestionDto);
      })

      test('then it should call questionsService', () => {
        expect(questionsService.update).toHaveBeenCalledWith(questionId, updateQuestionDto);
      })

      test('then it should return a question', () => {
        expect(question).toEqual(updatedQuestionStub());
      })
    })
  })

  describe('remove', () => {
    describe('When remove is called', () => {
      let question: Question;
      const questionId = new mongoose.Types.ObjectId("645fac0625f4bbf51f8f42e1")

      beforeEach(async () => {
        question = await controller.remove("COMMITTEE MEMBER", questionId)
      })

      test('then it should call questionsService', () => {
        expect(questionsService.remove).toBeCalledWith(questionId)
      })

      test('then it should return the deleted question', () => {
        expect(question).toEqual(questionStub());
      })
    })
  })
});
