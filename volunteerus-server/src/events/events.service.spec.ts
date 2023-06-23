import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { QuestionsService } from '../questions/questions.service';
import { Event } from './schemas/event.schema';
import { Question } from '../questions/schemas/question.schema';

describe('EventsService', () => {
  let service: EventsService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});