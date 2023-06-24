import { User } from '../../schemas/user.schema';
import mongoose from 'mongoose';

export const userStub = (): User => {
    return {
        full_name: 'Test User',
        email: 'test@u.nus.edu',
        password: 'Test_User_123',
        profile_picture: "",
        phone_number: "91234567",
        telegram_handle: "@testuser",
        faculty: "Faculty of Arts and Social Sciences",
        major: "Economics",
        year_of_study: 1,
        dietary_restrictions: "",
        registered_on: new Date("2023-06-23T06:04:41.967+00:00"),
        role: 'USER'
    };
}

export const userIdStub = (): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId('649536167a852a140aff2426');
}