import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { OrganizationsService } from '../../organizations/organizations.service';
import { Organization } from '../../organizations/schemas/organization.schema';
import { ContactsService } from '../../contacts/contacts.service';
import { Contact } from '../../contacts/schemas/contact.schema';
import { FirebasestorageService } from '../../firebasestorage/firebasestorage.service';
import { userStub, userIdStub } from './stubs/user.stub';

jest.mock("../users.service");

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        UsersService , {
          provide: getModelToken(User.name),
          useValue: jest.fn(),
        },
        OrganizationsService, {
          provide: getModelToken(Organization.name),
          useValue: jest.fn(),
        },
        ContactsService, {
          provide: getModelToken(Contact.name),
          useValue: jest.fn(),
        },
        FirebasestorageService,
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await usersController.findOne(userIdStub());
      });

      test("then it should call usersService", () => {
        expect(usersService.findOne).toBeCalledWith(userIdStub());
      });

      test("then it should return a user", () => {
        expect(user).toEqual(userStub());
      });
    })
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });
});
