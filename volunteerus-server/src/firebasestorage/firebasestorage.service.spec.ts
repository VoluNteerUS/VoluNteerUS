import { Test, TestingModule } from '@nestjs/testing';
import { FirebasestorageService } from './firebasestorage.service';

describe('FirebasestorageService', () => {
  let service: FirebasestorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebasestorageService],
    }).compile();

    service = module.get<FirebasestorageService>(FirebasestorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
