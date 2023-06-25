import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from '../organizations.controller';
import { OrganizationsService } from '../organizations.service';
import { FirebasestorageService } from '../../firebasestorage/firebasestorage.service';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';
import { getModelToken } from '@nestjs/mongoose';
import { Organization } from '../schemas/organization.schema';
import { ContactsService } from '../../contacts/contacts.service';
import { Contact } from '../../contacts/schemas/contact.schema';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/schemas/user.schema';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { organizationIdStub, organizationStub, paginatedOrganizationStub } from './stubs/organization.stub';
import { committeeMemberStub } from './stubs/committee-member.stub';
import { contactStub } from '../../contacts/test/stubs/contact.stub';
import { userIdStub } from '../../users/test/stubs/user.stub';
import { PaginationResult } from 'src/types/pagination';

jest.mock('../organizations.service');

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  let service: OrganizationsService;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

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
    service = module.get<OrganizationsService>(OrganizationsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let newOrganization: CreateOrganizationDto;
      let result: Organization;

      beforeEach(async () => {
        newOrganization = {
          name: 'Test Organization',
          description: 'Test Description',
          image_url: 'Test Image URL',
        };
        result = await controller.create("ADMIN", newOrganization, null);
      });

      it('then it should call organizationsService', () => {
        expect(service.create).toBeCalledWith(newOrganization);
      });

      it('then it should return an organization', () => {
        expect(result).toEqual(organizationStub());
      });

    });
  });

  describe('checkCommitteeMember', () => {
    describe('when checkCommitteeMember is called', () => {
      let result: boolean;

      beforeEach(async () => {
        result = await controller.checkCommitteeMember(committeeMemberStub());
      });

      it('then it should call organizationsService', () => {
        expect(service.checkCommitteeMember).toBeCalledWith(committeeMemberStub());
      });

      it('then it should return a boolean', () => {
        expect(result).toEqual(true);
      });
    });
  });

  describe('addContact', () => {
    describe('when addContactToOrganization is called', () => {
      let result: Organization;

      beforeEach(async () => {
        result = await controller.addContactToOrganization(organizationIdStub(), "ADMIN", contactStub());
      });

      it('then it should call organizationsService', () => {
        expect(service.addContactToOrganization).toBeCalledWith(organizationIdStub(), contactStub());
      });

      it('then it should return an organization', () => {
        expect(result).toEqual(organizationStub());
      });
    });
  });

  describe('addCommitteeMember', () => {
    describe('when addCommitteeMemberToOrganization is called', () => {
      let result: Organization;

      beforeEach(async () => {
        result = await controller.addCommitteeMembersToOrganization(organizationIdStub(), [userIdStub().toString()], "ADMIN");
      });

      it('then it should call organizationsService', () => {
        expect(service.addCommitteeMembersToOrganization).toBeCalledWith(organizationIdStub(), [userIdStub().toString()]);
      });

      it('then it should return an organization', () => {
        expect(result).toEqual(organizationStub());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let result: PaginationResult<Organization>;

      beforeEach(async () => {
        result = await controller.findAll(1, 10, '','ASC');
      });

      it('then it should call organizationsService', () => {
        expect(service.findAll).toBeCalledWith(1, 10, '','ASC');
      });

      it('then it should return an array of organizations', () => {
        expect(result).toEqual(paginatedOrganizationStub());
      });
    });
  });

  describe('count', () => {
    describe('when count is called', () => {
      let result: number;

      beforeEach(async () => {
        result = await controller.count();
      });

      it('then it should call organizationsService', () => {
        expect(service.count).toBeCalled();
      });

      it('then it should return a number', () => {
        expect(result).toEqual(1);
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let result: Organization;

      beforeEach(async () => {
        result = await controller.findOne(organizationIdStub());
      });

      it('then it should call organizationsService', () => {
        expect(service.findOne).toBeCalledWith(organizationIdStub());
      });

      it('then it should return an organization', () => {
        expect(result).toEqual(organizationStub());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let result: Organization;

      beforeEach(async () => {
        result = await controller.update(organizationIdStub(), "ADMIN", organizationStub(), null);
      });

      it('then it should call organizationsService', () => {
        expect(service.update).toBeCalledWith(organizationIdStub(), organizationStub());
      });

      it('then it should return an organization', () => {
        expect(result).toEqual(organizationStub());
      });
    });
  });

  describe('updateContact', () => {
    describe('when updateContact is called', () => {
      let result: Organization;

      beforeEach(async () => {
        result = await controller.updateContact(organizationIdStub(), "COMMITTEE MEMBER", contactStub());
      });

      it('then it should call organizationsService', () => {
        expect(service.updateContact).toBeCalledWith(organizationIdStub(), contactStub());
      });

      it('then it should return an organization', () => {
        expect(result).toEqual(organizationStub());
      });
    });
  });

  describe('updateCommitteeMembers', () => {
    describe('when updateCommitteeMembers is called', () => {
      let result: Organization;

      beforeEach(async () => {
        result = await controller.updateCommitteeMembers(organizationIdStub(), "ADMIN", [userIdStub().toString()]);
      });

      it('then it should call organizationsService', () => {
        expect(service.updateCommitteeMembers).toBeCalledWith(organizationIdStub(), [userIdStub().toString()]);
      });

      it('then it should return an organization', () => {
        expect(result).toEqual(organizationStub());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      let result: Organization;

      beforeEach(async () => {
        result = await controller.remove(organizationIdStub(), "ADMIN");
      });

      it('then it should call organizationsService', () => {
        expect(service.remove).toBeCalledWith(organizationIdStub());
      });

      it('then it should return an organization', () => {
        expect(result).toEqual(organizationStub());
      });
    });
  });
});
