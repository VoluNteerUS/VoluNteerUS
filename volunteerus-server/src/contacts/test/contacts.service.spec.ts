import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from '../contacts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Contact } from '../schemas/contact.schema';

describe('ContactsService', () => {
  let service: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService, {
          provide: getModelToken(Contact.name),
          useValue: jest.fn(),
        }
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
