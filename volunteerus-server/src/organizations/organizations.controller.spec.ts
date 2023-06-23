import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { FirebasestorageService } from '../firebasestorage/firebasestorage.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { getModelToken } from '@nestjs/mongoose';
import { Organization } from './schemas/organization.schema';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/schemas/contact.schema';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        OrganizationsService, {
          provide: getModelToken(Organization.name),
          useValue: jest.fn(),
        },
        ContactsService, {
          provide: getModelToken(Contact.name),
          useValue: jest.fn(),
        },
        UsersService, {
          provide: getModelToken(User.name),
          useValue: jest.fn(),
        },
        FirebasestorageService,
        CaslAbilityFactory
      ],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
