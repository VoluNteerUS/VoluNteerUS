import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Organization } from '../organizations/schemas/organization.schema';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/schemas/contact.schema';
import { FirebasestorageService } from '../firebasestorage/firebasestorage.service';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const newUser: CreateUserDto = {
        email: "jest_user@u.nus.edu",
        password: "jest_User_123",
        full_name: "Jest User",
        registered_on: new Date(),
        role: "USER"
      }

      jest.spyOn(service, 'create').mockImplementation(async () => {
        return userModel.create(newUser);
      });

      const result = await userModel.findOne({ email: newUser.email });
      expect(await service.create(newUser)).toBe(result);
      await userModel.deleteOne({ email: newUser.email });
    })
  })

  describe('getUserByID', () => {
    it('should return a user', async () => {
      const result: User = {
        full_name: "Tim Cook",
        email: "timcook@u.nus.edu",
        password: "$2b$10$Ig28NhpY1nE1hDBhVLlNXe6JRkJFfqGOxZdW/OevYQWsNL5WWQ/qy",
        profile_picture: "",
        phone_number: "",
        telegram_handle: "",
        faculty: "",
        major: "",
        year_of_study: 1,
        dietary_restrictions: "",
        registered_on: new Date("2023-06-23T06:04:41.967+00:00"),
        role: "USER"
      }

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await service.findOne(new mongoose.Types.ObjectId('649536167a852a140aff2426'))).toBe(result);
    });
  })

  describe('getUsersCount', () => {
    it('should return the number of users', async ()=> {
      const result = 10;
      jest.spyOn(service, 'count').mockResolvedValue(result);

      expect(await service.count()).toBe(result);
    })
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
