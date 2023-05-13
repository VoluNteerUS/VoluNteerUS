export class CreateUserDto {
  full_name: string;
  email: string;
  password: string;
  registered_on: Date;
  role: string;
}