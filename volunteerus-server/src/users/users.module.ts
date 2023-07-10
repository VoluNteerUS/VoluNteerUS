import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { Organization, OrganizationSchema } from 'src/organizations/schemas/organization.schema';
import { FirebasestorageModule } from 'src/firebasestorage/firebasestorage.module';
import { Event, EventSchema } from 'src/events/schemas/event.schema';
import { Response, ResponseSchema } from 'src/responses/schemas/response.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Organization.name, schema: OrganizationSchema},
      { name: Event.name, schema: EventSchema},
      { name: Response.name, schema: ResponseSchema}
    ]),
    FirebasestorageModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
