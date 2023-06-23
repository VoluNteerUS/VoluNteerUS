import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Contact } from './schemas/contact.schema';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';

describe('ContactsController', () => {
  let controller: ContactsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        ContactsService, {
          provide: getModelToken(Contact.name),
          useValue: jest.fn(),
        },
        CaslAbilityFactory
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
