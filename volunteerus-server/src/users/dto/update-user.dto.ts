import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    profile_picture: string;
    phone_number: string;
    telegram_handle: string;
    faculty: string;
    major: string;
    year_of_study: number;
    dietary_restrictions: string;
}