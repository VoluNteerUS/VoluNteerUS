import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from '../events.controller';
import { EventsService } from '../events.service';
import { getModelToken } from '@nestjs/mongoose';
import { QuestionsService } from '../../questions/questions.service';
import { Event } from '../schemas/event.schema';
import { Question } from '../../questions/schemas/question.schema';
import { FirebasestorageService } from '../../firebasestorage/firebasestorage.service';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';
import { eventIdStub, eventStub, paginatedEventStub, stringifyEventDate, stringifySignupByDate, updatedEventStub } from './stubs/event.stub';
import { PaginationResult } from '../../types/pagination';
import { CreateEventDto } from '../dto/create-event.dto';
import { organizationIdStub } from '../../organizations/test/stubs/organization.stub';
import { updatedQuestionStub } from '../../questions/test/stubs/question.stub';

jest.mock('../events.service');

describe('EventsController', () => {
  let controller: EventsController;
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        EventsService, {
          provide: getModelToken(Event.name),
          useValue: jest.fn(),
        },
        QuestionsService, {
          provide: getModelToken(Question.name),
          useValue: jest.fn(),
        },
        FirebasestorageService,
        CaslAbilityFactory
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(eventsService).toBeDefined();
  });

  describe('findOne', () => {
    describe('When findOne is called', () => {
      let event: Event;

      beforeEach(async () => {
        event = await controller.findOne(eventIdStub())
      })

      test('then it should call eventsService', () => {
        expect(eventsService.findOne).toBeCalledWith(eventIdStub())
      })

      test('then it should return an event', () => {
        expect(event).toEqual(eventStub());
      })
    })
  })

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let events: PaginationResult<Event>;

      describe("and organization_id query param is passed", () => {
        beforeEach(async () => {
          events = await controller.findAll(organizationIdStub(), 1, 1);
        });

        test("then it should call eventsService.getEventsByOrganization", () => {
          expect(eventsService.getEventsByOrganization).toBeCalledWith(organizationIdStub(), 1, 1);
        });

        test("then it should return a list of events", () => {
          expect(events).toEqual(paginatedEventStub());
        });

      });

      describe("and organization_id query param is not passed", () => {
        beforeEach(async () => {
          events = await controller.findAll(null, 1, 1);
        })
  
        test('then it should call eventsService.findAll', () => {
          expect(eventsService.findAll).toBeCalledWith("", "All", 1, 1);
        })
  
        test('then it should return events', () => {
          expect(events).toEqual(paginatedEventStub());
        })
      })
      
    })
  })

  describe('createEvent', () => {
    describe('when create is called', () => {
      let event: Event;
      let createEventDto: CreateEventDto;

      beforeEach(async () => {
        createEventDto = {
            title: eventStub().title,
            date: eventStub().date,
            location: eventStub().location,
            organized_by: eventStub().organized_by,
            category: eventStub().category,
            signup_by: eventStub().signup_by,
            description: eventStub().description,
            image_url: eventStub().image_url,
            questions: eventStub().questions,
            groupSettings: ["No", "-", "1"],
            defaultHours: eventStub().defaultHours
        }
        event = await controller.create("COMMITTEE MEMBER", createEventDto, null);
      })

      test('then it should call eventsService', () => {
        expect(eventsService.create).toHaveBeenCalledWith({ ...createEventDto, date: stringifyEventDate(), signup_by: stringifySignupByDate() });
      })

      test('then it should return an event', () => {
        expect({ ...event, date: eventStub().date, signup_by: eventStub().signup_by }).toEqual(eventStub());
      })
    })
  })

  describe('findLatestEvents', () => {
    describe('When findLatestEvents is called', () => {
      let event: Event[];

      beforeEach(async () => {
        event = await controller.findLatestEvents(1)
      })

      test('then it should call eventsService', () => {
        expect(eventsService.findLatestEvents).toBeCalledWith(1)
      })

      test('then it should return an array of events', () => {
        expect(event).toEqual([eventStub()]);
      })
    })
  })  

  describe('findUpcomingEvents', () => {
    describe('when findUpcomingEvents is called', () => {
      let events: PaginationResult<Event>;

      describe("and organization_id query param is passed", () => {
        beforeEach(async () => {
          events = await controller.findUpcomingEvents(organizationIdStub(), 1, 1);
        });

        test("then it should call eventsService.getUpcomingEventsByOrganization", () => {
          expect(eventsService.getUpcomingEventsByOrganization).toBeCalledWith(organizationIdStub(), 1, 1);
        });

        test("then it should return a list of events", () => {
          expect(events).toEqual(paginatedEventStub());
        });
      });

      describe("and organization_id query param is not passed", () => {
        beforeEach(async () => {
          events = await controller.findUpcomingEvents(null, 1, 1);
        })
  
        test('then it should call eventsService.findUpcomingEvents', () => {
          expect(eventsService.findUpcomingEvents).toBeCalledWith(1, 1);
        })
  
        test('then it should return events', () => {
          expect(events).toEqual(paginatedEventStub());
        })
      })
    })
  })

  describe('findPastEvents', () => {
    describe('when findPastEvents is called', () => {
      let events: PaginationResult<Event>;

      describe("and organization_id query param is passed", () => {
        beforeEach(async () => {
          events = await controller.findPastEvents(organizationIdStub(), 1, 1);
        });

        test("then it should call eventsService.getPastEventsByOrganization", () => {
          expect(eventsService.getPastEventsByOrganization).toBeCalledWith(organizationIdStub(), 1, 1);
        });

        test("then it should return a list of events", () => {
          expect(events).toEqual(paginatedEventStub());
        });
      });

      describe("and organization_id query param is not passed", () => {
        beforeEach(async () => {
          events = await controller.findPastEvents(null, 1, 1);
        })
  
        test('then it should call eventsService.findPastEvents', () => {
          expect(eventsService.findPastEvents).toBeCalledWith(1, 1);
        })
  
        test('then it should return events', () => {
          expect(events).toEqual(paginatedEventStub());
        })
      })
    })
  })

  describe('update', () => {
    describe('when update is called', () => {
      let event: Event;

      beforeEach(async () => {
        event = await controller.update(eventIdStub(), "COMMITTEE MEMBER", updatedEventStub(), null);
      });

      it('then it should call eventsService', () => {
        expect(eventsService.update).toBeCalledWith(eventIdStub(), { ...updatedEventStub(), date: stringifyEventDate(), signup_by: stringifySignupByDate() });
      });

      it('then it should return an event', () => {
        expect({ ...event, date: updatedEventStub().date, signup_by: updatedEventStub().signup_by }).toEqual(updatedEventStub());
      });
    });
  });

  describe('updateQuestions', () => {
    describe('when updateQuestions is called', () => {
      let event: Event;

      beforeEach(async () => {
        event = await controller.updateQuestions(eventIdStub(), "COMMITTEE MEMBER", updatedQuestionStub());
      });

      it('then it should call eventsService', () => {
        expect(eventsService.updateQuestions).toBeCalledWith(eventIdStub(), updatedQuestionStub());
      });

      it('then it should return the updated event', () => {
        expect(event).toEqual(updatedEventStub());
      });
    });
  });

  describe('getSignUpCount', () => {
    describe('when getSignUpCount is called', () => {
      let count: number;

      beforeEach(async () => {
        count = await controller.getSignUpCount(new Date(Date.now()));
      });

      it('then it should call eventsService', () => {
        expect(eventsService.getEventSignUpCount).toBeCalledWith(new Date(Date.now()));
      });

      it('then it should return the number of signups', () => {
        expect(count).toEqual(0);
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      let event: Event;

      beforeEach(async () => {
        event = await controller.remove(eventIdStub(), "COMMITTEE MEMBER");
      });

      it('then it should call eventsService', () => {
        expect(eventsService.remove).toBeCalledWith(eventIdStub());
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
        result = await controller.getCategories();
      });

      it('then it should call eventsService', () => {
        expect(eventsService.getCategories).toHaveBeenCalled();
      });

      it('then it should return an array of categories', () => {
        expect(result).toEqual(eventStub().category);
      });
    });
  });
});