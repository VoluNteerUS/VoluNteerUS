import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from '../questions.controller';
import { QuestionsService } from '../questions.service';
import { Question } from '../schemas/question.schema';
import { getModelToken } from '@nestjs/mongoose';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';
import { createQuestionDtoStub, questionIdStub, questionStub, updateQuestionDtoStub } from './stubs/question.stub';

jest.mock('../questions.service');

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let service: QuestionsService;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

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
    service = module.get<QuestionsService>(QuestionsService);
    jest.clearAllMocks();
  });

  describe("create", () => {
    describe("when create is called", () => {
      let question: Question;

      beforeEach(async () => {
        question = await controller.create("COMMITTEE MEMBER", createQuestionDtoStub());
      });

      test("then it should call questionService", () => {
        expect(service.create).toBeCalledWith(createQuestionDtoStub());
      });

      test("then it should return a question", () => {
        expect(question).toEqual(questionStub());
      });
    });
  });

  describe("findAll", () => {
    describe("when findAll is called", () => {
      let questions: Question[];

      beforeEach(async () => {
        questions = await controller.findAll();
      });

      test("then it should call questionService", () => {
        expect(service.findAll).toBeCalled();
      });

      test("then it should return questions", () => {
        expect(questions).toEqual([questionStub()]);
      });
    });
  });

  describe("findOne", () => {
    describe("when findOne is called", () => {
      let question: Question;

      beforeEach(async () => {
        question = await controller.findOne(questionIdStub());
      });

      test("then it should call questionService", () => {
        expect(service.findOne).toBeCalledWith(questionIdStub());
      });

      test("then it should return a question", () => {
        expect(question).toEqual(questionStub());
      });
    });
  });

  describe("update", () => {
    describe("when update is called", () => {
      let question: Question;

      beforeEach(async () => {
        question = await controller.update(questionIdStub(), "COMMITTEE MEMBER", updateQuestionDtoStub());
      });

      test("then it should call questionService", () => {
        expect(service.update).toBeCalledWith(questionIdStub(), updateQuestionDtoStub());
      });

      test("then it should return a question", () => {
        expect(question).toEqual(updateQuestionDtoStub());
      });
    });
  });

  describe("remove", () => {
    describe("when remove is called", () => {
      beforeEach(async () => {
        await controller.remove("COMMITTEE MEMBER", questionIdStub());
      });

      test("then it should call questionService", () => {
        expect(service.remove).toBeCalledWith(questionIdStub());
      });
    });
  });
});