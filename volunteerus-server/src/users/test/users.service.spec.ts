import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { OrganizationsService } from '../../organizations/organizations.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Organization } from '../../organizations/schemas/organization.schema';
import { ContactsService } from '../../contacts/contacts.service';
import { Contact } from '../../contacts/schemas/contact.schema';
import { FirebasestorageService } from '../../firebasestorage/firebasestorage.service';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { userStub } from './stubs/user.stub';

jest.mock('../users.service');

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UsersService, {
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

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    describe("when createUser is called", () => {
      let user: User;
      let newUser: CreateUserDto;

      beforeEach(async () => {
        jest.spyOn(service, 'create');
        newUser = {
          full_name: userStub().full_name,
          email: userStub().email,
          password: userStub().password,
          registered_on: userStub().registered_on,
          role: userStub().role
        }
        user = await service.create(newUser);
      });

      test('it should call the userModel', () => {
        expect(service.create).toBeCalledWith(newUser);
      });

      test('it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });

  describe('getUserByID', () => {
    describe('when getUserByID is called', () => {
      let user: User;
      describe('and if the user is found', () => {
        beforeEach(async () => {
          jest.spyOn(service, 'findOne').mockResolvedValue(userStub());
          user = await service.findOne(new mongoose.Types.ObjectId('649536167a852a140aff2426'));
        });

        test('it should call the userModel', () => {
          expect(service.findOne).toBeCalledWith(new mongoose.Types.ObjectId('649536167a852a140aff2426'));
        });

        test('it should return a user', () => {
          expect(user).toEqual(userStub());
        });

      });

      describe('and if the user is not found', () => {
        beforeEach(async () => {
          jest.spyOn(service, 'findOne').mockResolvedValue(null);
          user = await service.findOne(new mongoose.Types.ObjectId('649536167a852a140aff2426'));
        });

        test('it should call the userModel', () => {
          expect(service.findOne).toBeCalledWith(new mongoose.Types.ObjectId('649536167a852a140aff2426'));
        });

        test('it should return a null', () => {
          expect(user).toEqual(null);
        });
      });
        
    });
  });

  describe('getUsersCount', () => {
    it('should return the number of users', async ()=> {
      const result = 10;
      jest.spyOn(service, 'count').mockResolvedValue(result);

      expect(await service.count()).toBe(result);
    });
  });
});
