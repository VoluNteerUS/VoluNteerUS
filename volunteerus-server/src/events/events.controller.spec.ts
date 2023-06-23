import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { QuestionsService } from '../questions/questions.service';
import { Event } from './schemas/event.schema';
import { Question } from '../questions/schemas/question.schema';
import { FirebasestorageService } from '../firebasestorage/firebasestorage.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';

describe('EventsController', () => {
  let controller: EventsController;

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
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});