import { Test, TestingModule } from '@nestjs/testing';
import { ResponsesService } from '../responses.service';
import { getModelToken } from '@nestjs/mongoose';
import { Response } from '../schemas/response.schema';

describe('ResponsesService', () => {
  let service: ResponsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponsesService, 
        {
          provide: getModelToken(Response.name),
          useValue: jest.fn(),
        }
      ],
    }).compile();

    service = module.get<ResponsesService>(ResponsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
