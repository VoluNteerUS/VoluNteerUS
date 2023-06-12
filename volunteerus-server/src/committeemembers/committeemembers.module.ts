import { Module } from '@nestjs/common';
import { CommitteeMembersService } from './committeemembers.service';
import { CommitteeMembersController } from './committeemembers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommitteeMember, CommitteeMemberSchema } from './schemas/committeemember.schema';
import { Organization, OrganizationSchema } from 'src/organizations/schemas/organization.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommitteeMember.name, schema: CommitteeMemberSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: User.name, schema: UserSchema }
    ]),
    CaslModule
  ],
  controllers: [CommitteeMembersController],
  providers: [CommitteeMembersService]
})
export class CommitteeMembersModule {}
