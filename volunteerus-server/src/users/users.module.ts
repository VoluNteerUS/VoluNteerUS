import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { Organization, OrganizationSchema } from 'src/organizations/schemas/organization.schema';
import { FirebasestorageModule } from 'src/firebasestorage/firebasestorage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema}
    ]),
    FirebasestorageModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
