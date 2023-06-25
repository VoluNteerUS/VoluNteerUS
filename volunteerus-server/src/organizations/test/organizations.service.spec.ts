import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from '../organizations.service';
import { ContactsService } from '../../contacts/contacts.service';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from '../../users/users.service';
import { Organization } from '../schemas/organization.schema';
import { Contact } from '../../contacts/schemas/contact.schema';
import { User } from '../../users/schemas/user.schema';

describe('OrganizationsService', () => {
  let service: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService, 
        {
          provide: getModelToken(Organization.name),
          useValue: jest.fn(),
        },
        ContactsService,
        {
          provide: getModelToken(Contact.name),
          useValue: jest.fn(),
        },
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: jest.fn(),
        }
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
