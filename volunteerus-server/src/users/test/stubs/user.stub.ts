import { Types } from "mongoose";
import { User } from "../../schemas/user.schema";

export const userStub = (): User => {
  return {
    full_name: "Full name",
    email: "test@gmail.com",
    password: "",
    registered_on: new Date("2023-06-23T06:04:41.967+00:00"),
    role: "USER",
    profile_picture: '',
    phone_number: '',
    telegram_handle: '',
    faculty: '',
    major: '',
    year_of_study: 1,
    dietary_restrictions: '',
    skills: [],
  }      
};

export const userIdStub = (): Types.ObjectId => {
  return new Types.ObjectId("645fac0625f4bbf51f8f42e1");
};