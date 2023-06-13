import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organization, OrganizationSchema } from './schemas/organization.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebasestorageModule } from 'src/firebasestorage/firebasestorage.module';
import { Contact, ContactSchema } from 'src/contacts/schemas/contact.schema';
import { CaslModule } from 'src/casl/casl.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema},
      { name: Contact.name, schema: ContactSchema},
      { name: User.name, schema: UserSchema }
    ]),
    FirebasestorageModule,
    CaslModule,
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService]
})

export class OrganizationsModule {}