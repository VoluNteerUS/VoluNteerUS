import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from '../events.service';
import { getModelToken } from '@nestjs/mongoose';
import { QuestionsService } from '../../questions/questions.service';
import { Event, EventDocument } from '../schemas/event.schema';
import { Question } from '../../questions/schemas/question.schema';
import { Model } from 'mongoose';
import { eventIdStub, eventStub, paginatedEventStub, stringifyEventDate, stringifySignupByDate, updatedEventStub } from './stubs/event.stub';
import { CreateEventDto } from '../dto/create-event.dto';
import { PaginationResult } from '../../types/pagination';
import { updatedQuestionStub } from '../../questions/test/stubs/question.stub';
import { organizationIdStub } from '../../organizations/test/stubs/organization.stub';

jest.mock('../events.service');

describe('EventsService', () => {
  let service: EventsService;
  let eventModel: Model<EventDocument>;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService, {
          provide: getModelToken(Event.name),
          useValue: jest.fn(),
        },
        QuestionsService, {
          provide: getModelToken(Question.name),
          useValue: jest.fn(),
        }
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventModel = module.get<Model<EventDocument>>(getModelToken(Event.name));
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    describe("when createEvent is called", () => {
      let event: Event;
      let newEvent: CreateEventDto;

      beforeEach(async () => {
        jest.spyOn(service, 'create');
        newEvent = {
          title: eventStub().title,
            date: eventStub().date,
            location: eventStub().location,
            organized_by: eventStub().organized_by,
            category: eventStub().category,
            signup_by: eventStub().signup_by,
            description: eventStub().description,
            image_url: eventStub().image_url,
            questions: eventStub().questions,
            groupSettings: eventStub().groupSettings,
            defaultHours: eventStub().defaultHours,
        }
        event = await service.create(newEvent);
      });

      test('it should call the eventModel', () => {
        expect(service.create).toBeCalledWith(newEvent);
      });

      test('it should return an event', () => {
        expect(event).toEqual(eventStub());
      });
    });
  });

  describe('findOne', () => {
    describe('When findOne is called', () => {
      let event: Event;

      beforeEach(async () => {
        jest.spyOn(service, 'findOne');
        event = await service.findOne(eventIdStub())
      })

      test('then it should call eventModel', () => {
        expect(service.findOne).toBeCalledWith(eventIdStub())
      })

      test('then it should return an event', () => {
        expect(event).toEqual(eventStub());
      })
    })
  })

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let events: PaginationResult<Event>;

      beforeEach(async () => {
        jest.spyOn(service, 'findAll');
        events = await service.findAll("", "All", 1, 1);
      });

      test("then it should call eventModel", () => {
        expect(service.findAll).toBeCalledWith("", "All", 1, 1);
      });

      test("then it should return a list of events", () => {
        expect(events).toEqual(paginatedEventStub());
      });
    })
  })

  describe('findLatestEvents', () => {
    describe('When findLatestEvents is called', () => {
      let event: Event[];

      beforeEach(async () => {
        jest.spyOn(service, 'findLatestEvents');
        event = await service.findLatestEvents(1)
      })

      test('then it should call eventModel', () => {
        expect(service.findLatestEvents).toBeCalledWith(1)
      })

      test('then it should return an array of events', () => {
        expect(event).toEqual([eventStub()]);
      })
    })
  })  

  describe('findUpcomingEvents', () => {
    describe('when findUpcomingEvents is called', () => {
      let events: PaginationResult<Event>;

      beforeEach(async () => {
        jest.spyOn(service, 'findUpcomingEvents');
        events = await service.findUpcomingEvents('', [''], 1, 1);
      });

      test("then it should call eventModel", () => {
        expect(service.findUpcomingEvents).toBeCalledWith(1, 1);
      });

      test("then it should return a list of events", () => {
        expect(events).toEqual(paginatedEventStub());
      });
    })
  })

  describe('findPastEvents', () => {
    describe('when findPastEvents is called', () => {
      let events: PaginationResult<Event>;

      beforeEach(async () => {
        jest.spyOn(service, 'findPastEvents');
        events = await service.findPastEvents(1, 1);
      });

      test("then it should call eventModel", () => {
        expect(service.findPastEvents).toBeCalledWith(1, 1);
      });

      test("then it should return a list of events", () => {
        expect(events).toEqual(paginatedEventStub());
      });
    })
  })

  describe('getEventSignUpCount', () => {
    describe('when getEventSignUpCount is called', () => {
      let count: number;

      beforeEach(async () => {
        jest.spyOn(service, 'getEventSignUpCount');
        count = await service.getEventSignUpCount(new Date(Date.now()));
      });

      test("then it should call eventModel", () => {
        expect(service.getEventSignUpCount).toBeCalledWith(new Date(Date.now()));
      });

      test("then it should return the number of signups", () => {
        expect(count).toEqual(0);
      });
    })
  })

  describe('update', () => {
    describe('when update is called', () => {
      let event: Event;

      beforeEach(async () => {
        jest.spyOn(service, 'update');
        event = await service.update(eventIdStub(), updatedEventStub());
      });

      it('then it should call eventModel', () => {
        expect(service.update).toBeCalledWith(eventIdStub(), updatedEventStub());
      });

      it('then it should return an event', () => {
        expect(event).toEqual(updatedEventStub());
      });
    });
  });

  describe('updateQuestions', () => {
    describe('when updateQuestions is called', () => {
      let event: Event;

      beforeEach(async () => {
        jest.spyOn(service, 'updateQuestions');
        event = await service.updateQuestions(eventIdStub(), updatedQuestionStub());
      });

      it('then it should call eventModel', () => {
        expect(service.updateQuestions).toBeCalledWith(eventIdStub(), updatedQuestionStub());
      });

      it('then it should return the updated event', () => {
        expect(event).toEqual(updatedEventStub());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      let event: Event;

      beforeEach(async () => {
        jest.spyOn(service, 'remove');
        event = await service.remove(eventIdStub());
      });

      it('then it should call eventsModel', () => {
        expect(service.remove).toBeCalledWith(eventIdStub());
      });

      it('then it should return an event', () => {
        expect(event).toEqual(eventStub());
      });
    });
  });

  describe('getCategories', () => {
    describe('when getCategories is called', () => {
      let result: String[];

      beforeEach(async () => {
        result = await service.getCategories();
      });

      it('then it should call eventModel', () => {
        expect(service.getCategories).toHaveBeenCalled();
      });

      it('then it should return an array of categories', () => {
        expect(result).toEqual(eventStub().category);
      });
    });
  });

  describe('getEventsByOrganization', () => {
    describe('when getEventsByOrganization is called', () => {
      let event: PaginationResult<Event>;

      beforeEach(async () => {
        event = await service.getEventsByOrganization(organizationIdStub(), 1, 1);
      });

      it('then it should call eventsModel', () => {
        expect(service.getEventsByOrganization).toBeCalledWith(organizationIdStub(), 1, 1);
      });

      it('then it should return a list of events', () => {
        expect(event).toEqual(paginatedEventStub());
      });
    });
  });

  describe('getUpcomingEventsByOrganization', () => {
    describe('when getUpcomingEventByOrganization is called', () => {
      let event: PaginationResult<Event>;

      beforeEach(async () => {
        event = await service.getUpcomingEventsByOrganization(organizationIdStub(), 1, 1);
      });

      it('then it should call eventsModel', () => {
        expect(service.getUpcomingEventsByOrganization).toBeCalledWith(organizationIdStub(), 1, 1);
      });

      it('then it should return a list of events', () => {
        expect(event).toEqual(paginatedEventStub());
      });
    });
  });

  describe('getPastEventsByOrganization', () => {
    describe('when getPastEventByOrganization is called', () => {
      let event: PaginationResult<Event>;

      beforeEach(async () => {
        event = await service.getPastEventsByOrganization(organizationIdStub(), 1, 1);
      });

      it('then it should call eventsModel', () => {
        expect(service.getPastEventsByOrganization).toBeCalledWith(organizationIdStub(), 1, 1);
      });

      it('then it should return a list of events', () => {
        expect(event).toEqual(paginatedEventStub());
      });
    });
  });
});