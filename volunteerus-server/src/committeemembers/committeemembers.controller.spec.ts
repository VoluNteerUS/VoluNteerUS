import { Test, TestingModule } from '@nestjs/testing';
import { CommitteeMembersController } from './committeemembers.controller';
import { CommitteeMembersService } from './committeemembers.service';

describe('CommitteeMembersController', () => {
  let controller: CommitteeMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitteeMembersController],
      providers: [CommitteeMembersService],
    }).compile();

    controller = module.get<CommitteeMembersController>(CommitteeMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
