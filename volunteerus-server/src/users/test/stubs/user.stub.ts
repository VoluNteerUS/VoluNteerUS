import { User } from "../../schemas/user.schema";

export const userStub = (): User => {
  return {
    full_name: "Full name",
    email: "test@gmail.com",
    password: "",
    registered_on: new Date(2023, 10, 20),
    role: "USER",
    profile_picture: '',
    phone_number: '',
    telegram_handle: '',
    faculty: '',
    major: '',
    year_of_study: 1,
    dietary_restrictions: '',
  }      
}
