import { Test, TestingModule } from '@nestjs/testing';
import { FirebasestorageService } from '../firebasestorage.service';

jest.mock('../firebasestorage.service');

describe('FirebasestorageService', () => {
  let service: FirebasestorageService;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebasestorageService],
    }).compile();

    service = module.get<FirebasestorageService>(FirebasestorageService);
    jest.clearAllMocks();
  });

  describe('uploadFile', () => {
    let file: any;
    let file_url: Promise<string>;
    beforeEach(() => {
      file_url = service.uploadFile(file, "test");
    });
    it('should return a string', () => {
      expect(service.uploadFile(file, "test")).toBeInstanceOf(Promise);
    });
  });
});
