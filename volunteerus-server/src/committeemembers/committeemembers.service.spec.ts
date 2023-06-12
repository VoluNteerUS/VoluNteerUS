import { Test, TestingModule } from '@nestjs/testing';
import { CommitteeMembersService } from './committeemembers.service';

describe('CommitteemembersService', () => {
  let service: CommitteeMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommitteeMembersService],
    }).compile();

    service = module.get<CommitteeMembersService>(CommitteeMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
