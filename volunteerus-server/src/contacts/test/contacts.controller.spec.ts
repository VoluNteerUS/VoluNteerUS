import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from '../contacts.controller';
import { ContactsService } from '../contacts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Contact } from '../schemas/contact.schema';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';
import { contactIdStub, contactStub } from './stubs/contact.stub';
import { CreateContactDto } from '../dto/create-contact.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';

jest.mock('../contacts.service');

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: ContactsService;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

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
    service = module.get<ContactsService>(ContactsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    describe('when create is called', () => {
      let contact: Contact;
      let contactDto: CreateContactDto;

      beforeEach(async () => {
        contactDto = contactStub();
        contact = await controller.create("ADMIN", contactDto);
      });

      test('then it should call contactsService.create()', () => {
        expect(service.create).toHaveBeenCalledWith(contactStub());
      });

      test('then it should return a contact', () => {
        expect(contact).toEqual(contactStub());
      });
    });
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let contacts: Contact[];

      beforeEach(async () => {
        contacts = await controller.findAll();
      });

      test('then it should call contactsService.findall()', () => {
        expect(service.findAll).toHaveBeenCalled();
      });

      test('then it should return an array of contacts', () => {
        expect(contacts).toEqual([contactStub()]);
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let contact: Contact;

      beforeEach(async () => {
        contact = await controller.findOne(contactIdStub());
      });

      test('then it should call contactsService.findOne()', () => {
        expect(service.findOne).toHaveBeenCalledWith(contactIdStub());
      });

      test('then it should return a contact', () => {
        expect(contact).toEqual(contactStub());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let contact: Contact;
      let contactDto: UpdateContactDto;

      beforeEach(async () => {
        contactDto = contactStub();
        contact = await controller.update(contactIdStub(), "ADMIN", contactDto);
      });
      
      test('then it should call contactsService.update()', () => {
        expect(service.update).toHaveBeenCalledWith(contactIdStub(), contactDto);
      });
      
      test('then it should return a contact', () => {
        expect(contact).toEqual(contactStub());
      });
    });
  });

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await controller.remove(contactIdStub(), "ADMIN");
      });

      test('then it should call contactsService.remove()', () => {
        expect(service.remove).toHaveBeenCalledWith(contactIdStub());
      });
    });
  });

});
