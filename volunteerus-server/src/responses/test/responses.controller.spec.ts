import { Test, TestingModule } from '@nestjs/testing';
import { ResponsesController } from '../responses.controller';
import { ResponsesService } from '../responses.service';
import { getModelToken } from '@nestjs/mongoose';
import { Response } from '../schemas/response.schema';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';
import { CreateResponseDto } from '../dto/create-response.dto';
import { paginatedResponseStub, responseIdStub, responseStub, updatedResponseStub } from './stubs/response.stub';
import { userIdStub } from './stubs/response.stub';
import { eventIdStub } from '../../events/test/stubs/event.stub';
import { PaginationResult } from 'src/types/pagination';
import { UpdateResponseDto } from '../dto/update-response.dto';

jest.mock('../responses.service');

describe('ResponsesController', () => {
  let controller: ResponsesController;
  let service: ResponsesService;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponsesController],
      providers: [
        ResponsesService, {
          provide: getModelToken(Response.name),
          useValue: jest.fn(),
        },
        CaslAbilityFactory
      ],
    }).compile();

    controller = module.get<ResponsesController>(ResponsesController);
    service = module.get<ResponsesService>(ResponsesService);
    jest.clearAllMocks();
  });

  describe("create", () => {
    describe("when create is called", () => {
      let response: Response;
      let createResponseDto: CreateResponseDto;

      beforeEach(async () => {
        createResponseDto = {
          event: responseStub().event,
          user: responseStub().user,
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          status: responseStub().status,
          submitted_on: responseStub().submitted_on,
          selected_users: []
        }
        response = await controller.create("COMMITTEE MEMBER", createResponseDto);
      });

      test("then it should call service", () => {
        expect(service.create).toBeCalledWith(createResponseDto);
      });

      test("then it should return a response", () => {
        expect(response).toEqual(responseStub());
      });

    });
  });

  describe("findAll", () => {
    describe("when findAll is called", () => {
      let responses: Response[];

      describe("and no query params are passed", () => {

        beforeEach(async () => {
          responses = await controller.findAll(null, null);
        });

        test("then it should call service.findAll", () => {
          expect(service.findAll).toBeCalled();
        });

        test("then it should return a list of responses", () => {
          expect(responses).toEqual([responseStub()]);
        });
      });

      describe("and when user_id query param is passed", () => {
        beforeEach(async () => {
          responses = await controller.findAll(userIdStub(), null);
        });

        test("then it should call service.getResponsesByUser", () => {
          expect(service.getResponsesByUser).toBeCalledWith(userIdStub());
        });

        test("then it should return a list of responses", () => {
          expect(responses).toEqual([responseStub()]);
        });
      });

      describe("and when event_id query param is passed", () => {
        beforeEach(async () => {
          responses = await controller.findAll(null, eventIdStub());
        });

        test("then it should call service.getResponsesByEvent", () => {
          expect(service.getResponsesByEvent).toBeCalledWith(eventIdStub());
        });

        test("then it should return a list of responses", () => {
          expect(responses).toEqual([responseStub()]);
        });
      });
    });
  });

  describe("findAcceptedResponses", () => {
    describe("when findAcceptedResponses is called", () => {
      let responses: PaginationResult<Response>;

      describe("and event_id query param is passed", () => {
        beforeEach(async () => {
          responses = await controller.findAcceptedResponses(eventIdStub(), null, 1, 1);
        });

        test("then it should call service.getAcceptedResponsesByEvent", () => {
          expect(service.getAcceptedResponsesByEvent).toBeCalledWith(eventIdStub(), 1, 1);
        });

        test("then it should return a list of responses", () => {
          expect(responses).toEqual(paginatedResponseStub());
        });

      });

      describe("and user_id query param is passed", () => {
        beforeEach(async () => {
          responses = await controller.findAcceptedResponses(null, userIdStub(), 1, 1);
        });

        test("then it should call service.getAcceptedResponsesByUser", () => {
          expect(service.getAcceptedResponsesByUser).toBeCalledWith(userIdStub(), 1, 1);
        });

        test("then it should return a list of responses", () => {
          expect(responses).toEqual(paginatedResponseStub());
        });

      });
    });
  });

  describe("findPendingResponses", () => {
    describe("when findPendingResponses is called", () => {
      let responses: PaginationResult<Response>;

      describe("and event_id query param is passed", () => {
        beforeEach(async () => {
          responses = await controller.findPendingResponses(eventIdStub(), null, 1, 1);
        });

        test("then it should call service.getPendingResponsesByEvent", () => {
          expect(service.getPendingResponsesByEvent).toBeCalledWith(eventIdStub(), 1, 1);
        });

        test("then it should return a list of responses", () => {
          expect(responses).toEqual(paginatedResponseStub());
        });

      });

      describe("and user_id query param is passed", () => {
        beforeEach(async () => {
          responses = await controller.findPendingResponses(null, userIdStub(), 1, 1);
        });

        test("then it should call service.getPendingResponsesByUser", () => {
          expect(service.getPendingResponsesByUser).toBeCalledWith(userIdStub(), 1, 1);
        });

        test("then it should return a list of responses", () => {
          expect(responses).toEqual(paginatedResponseStub());
        });

      });
    });
  });

  describe("findRejectedResponses", () => {
    describe("when findRejectedResponses is called", () => {
      let responses: PaginationResult<Response>;

      describe("and event_id query param is passed", () => {
        beforeEach(async () => {
          responses = await controller.findRejectedResponses(eventIdStub(), null, 1, 1);
        });

        test("then it should call service.getRejectedResponsesByEvent", () => {
          expect(service.getRejectedResponsesByEvent).toBeCalledWith(eventIdStub(), 1, 1);
        });

        test("then it should return a list of responses", () => {
          expect(responses).toEqual(paginatedResponseStub());
        });

      });

      describe("and user_id query param is passed", () => {
        beforeEach(async () => {
          responses = await controller.findRejectedResponses(null, userIdStub(), 1, 1);
        });

        test("then it should call service.getRejectedResponsesByUser", () => {
          expect(service.getRejectedResponsesByUser).toBeCalledWith(userIdStub(), 1, 1);
        });

        test("then it should return a list of responses", () => {
          expect(responses).toEqual(paginatedResponseStub());
        });

      });
    });
  });

  describe("findOne", () => {
    describe("when findOne is called", () => {
      let response: Response;

      beforeEach(async () => {
        response = await controller.findOne(responseIdStub());
      });

      test("then it should call service.findOne", () => {
        expect(service.findOne).toBeCalledWith(responseIdStub());
      });

      test("then it should return a response", () => {
        expect(response).toEqual(responseStub());
      });
    });
  });

  describe('totalHours', () => {
    describe('when totalHours is called', () => {
      let result: number;

      beforeEach(async () => {
        result = await controller.getTotalHours(userIdStub());
      });

      it('then it should call service.getTotalHours', () => {
        expect(service.getTotalHours).toBeCalled();
      });

      it('then it should return a number', () => {
        expect(result).toEqual(2);
      });
    });
  });

  describe("findPastAcceptedResponseByUser", () => {
    describe("when findPastAcceptedResponseByUser is called", () => {
      let responses: PaginationResult<Response>;

      beforeEach(async () => {
        responses = await controller.findPastAcceptedResponsesByUser(userIdStub(), 1, 1);
      });

      test("then it should call service.getPastAcceptedResponsesByUser", () => {
        expect(service.getPastAcceptedResponsesByUser).toBeCalledWith(userIdStub(), 1, 1);
      });

      test("then it should return a list of responses", () => {
        expect(responses).toEqual(paginatedResponseStub());
      });

    });
  });

  describe("update", () => {
    describe("when update is called", () => {
      let response: Response;
      let updateResponseDto: UpdateResponseDto;

      beforeEach(async () => {
        updateResponseDto = {
          status: "Accepted",
        };
        response = await controller.update(responseIdStub(), "COMMITTEE MEMBER", updateResponseDto);
      });

      test("then it should call service.update", () => {
        expect(service.update).toBeCalledWith(responseIdStub(), updateResponseDto);
      });

      test("then it should return a response", () => {
        expect(response).toEqual(updatedResponseStub());
      });
    });
  });

  describe("remove", () => {
    describe("when remove is called", () => {
      let response: Response;

      beforeEach(async () => {
        response = await controller.remove(responseIdStub(), "COMMITTEE MEMBER");
      });

      test("then it should call service.remove", () => {
        expect(service.remove).toBeCalledWith(responseIdStub());
      });

      test("then it should return a response", () => {
        expect(response).toEqual(responseStub());
      });
    });
  });
});
