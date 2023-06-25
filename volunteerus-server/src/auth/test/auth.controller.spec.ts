import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../users/schemas/user.schema';
import { OrganizationsService } from '../../organizations/organizations.service';
import { Organization } from '../../organizations/schemas/organization.schema';
import { ContactsService } from '../../contacts/contacts.service';
import { Contact } from '../../contacts/schemas/contact.schema';
import { userStub } from '../../users/test/stubs/user.stub';

jest.mock('../auth.service');

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
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
        }
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('login', () => {
    describe('when login is called', () => {
      let result: any;
      let body: any;

      beforeEach(async () => {
        body = {
          email: 'test@gmail.com',
          password: 'password'
        };
        result = await controller.login({ email: body.email, password: body.password });
      });

      it('then it should call authService', () => {
        expect(service.validateUser).toHaveBeenCalledWith(body.email, body.password);
      });

      it('then it should return token', () => {
        expect(result).toEqual({});
      });
    });
  });

  describe('getProfile', () => {
    describe('when getProfile is called', () => {
      let user: User;

      beforeEach(async () => {
        user = await controller.getProfile({});
      });

      it('then it should call authService', () => {
        expect(service.getProfile).toHaveBeenCalled();
      });

      it('then it should return user', () => {
        expect(user).toEqual(userStub());
      });

    });
  });
});