import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from '../dto/update-user.dto';
import { userIdStub, userStub } from '../test/stubs/user.stub';
import { CreateUserDto } from '../dto/create-user.dto';
import { PaginationResult } from '../../types/pagination';
import mongoose from 'mongoose';
import { FirebasestorageService } from '../../firebasestorage/firebasestorage.service';
import { Organization } from '../../organizations/schemas/organization.schema';
import { organizationStub } from '../../organizations/test/stubs/organization.stub';

jest.mock('../users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService, FirebasestorageService]
    }).compile();

    controller = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  })

  describe('findOne', () => {
    describe('When findOne is called', () => {
      let user: User;
      const userId = new mongoose.Types.ObjectId("645fac0625f4bbf51f8f42e1")

      beforeEach(async () => {
        user = await controller.findOne(userId)
      })

      test('then it should call usersService', () => {
        expect(usersService.findOne).toBeCalledWith(userId)
      })

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      })
    })
  })

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let users: PaginationResult<User>;

      beforeEach(async () => {
        users = await controller.findAll();
      })

      test('then it should call usersService', () => {
        expect(usersService.findAll).toHaveBeenCalled();
      })

      test('then it should return users', () => {
        expect(users).toEqual([userStub()]);
      })
    })
  })

  describe('createUser', () => {
    describe('when create is called', () => {
      let user: User;
      let createUserDto: CreateUserDto;

      beforeEach(async () => {
        createUserDto = {
          full_name: userStub().full_name,
          email: userStub().email,
          password: userStub().password,
          registered_on: userStub().registered_on,
          role: userStub().role
        }
        user = await controller.create(createUserDto);
      })

      test('then it should call usersService', () => {
        expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      })

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      })
    })
  })

  describe('updateUser', () => {
    describe('when update is called', () => {
      let user: User;
      let updateUserDto: UpdateUserDto;
      const userId = new mongoose.Types.ObjectId("645fac0625f4bbf51f8f42e1");

      beforeEach(async () => {
        updateUserDto = {
            profile_picture: '',
            phone_number: '',
            telegram_handle: '',
            faculty: '',
            major: '',
            year_of_study: 2,
            dietary_restrictions: '',
        }
        user = await controller.update(userId, updateUserDto, null);
      })

      test('then it should call usersService', () => {
        expect(usersService.update).toHaveBeenCalledWith(userId, updateUserDto);
      })

      test('then it should return a user', () => {
        expect(user).toEqual({ ...userStub(), year_of_study: 2 });
      })
    })
  })

  describe('getCommitteeMemberCount', () => {
    describe('when getCommitteeMemberCount is called', () => {
      let count: Number;

      beforeEach(async () => {
        count = await controller.getCommitteeMemberCount();
      })

      test('then it should call usersService', () => {
        expect(usersService.getCommitteeMemberCount).toHaveBeenCalled();
      })

      test('then it should return number of committee members', () => {
        expect(count).toEqual(0);
      })
    })
  })

  describe('count', () => {
    describe('when count is called', () => {
      let count: Number;

      beforeEach(async () => {
        count = await controller.count();
      })

      test('then it should call usersService', () => {
        expect(usersService.count).toHaveBeenCalled();
      })

      test('then it should return number of users', () => {
        expect(count).toEqual(1);
      })
    })
  })

  describe('findOneByEmail', () => {
    describe('When findOneByEmail is called', () => {
      let user: User;
      const email = userStub().email;

      beforeEach(async () => {
        user = await controller.findOneByEmail(email)
      })

      test('then it should call usersService', () => {
        expect(usersService.findOneByEmail).toBeCalledWith(email)
      })

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      })
    })
  })

  describe('findUsers', () => {
    describe('when findUsers is called', () => {
      let users: User[];

      beforeEach(async () => {
        users = await controller.findUsers("Full name");
      })

      test('then it should call usersService', () => {
        expect(usersService.findUsers).toHaveBeenCalled();
      })

      test('then it should return users', () => {
        expect(users).toEqual([userStub()]);
      })
    })
  })

  describe('findUserOrganizations', () => {
    describe('when findUserOrganizations is called', () => {
      let organizations: Organization[];
      beforeEach(async () => {
        organizations = await controller.findUserOrganizations(userIdStub().toString());
      });

      test('then it should call usersService', () => {
        expect(usersService.findUserOrganizations).toBeCalledWith(userIdStub().toString());
      });

      test('then it should return organizations', () => {
        expect(organizations).toEqual([organizationStub()]);
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      let user: User;
      beforeEach(async () => {
        user = await controller.remove(userIdStub());
      });

      test('then it should call usersService', () => {
        expect(usersService.delete).toBeCalledWith(userIdStub());
      });

      test('then it should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });
});