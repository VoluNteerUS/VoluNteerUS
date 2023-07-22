import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from '@nestjs/class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    full_name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    @Exclude()
    password: string;

    @Prop({ default: '' })
    profile_picture: string;

    @Prop({ default: '' })
    phone_number: string;

    @Prop({ default: '' })
    telegram_handle: string;

    @Prop({ default: '' })
    faculty: string;

    @Prop({ default: '' })
    major: string;

    @Prop({ default: 1 })
    year_of_study: number;

    @Prop({ default: '' })
    dietary_restrictions: string;

    @Prop({ type: [String], default: [] })
    skills: string[];

    @Prop({ default: Date.now() })
    registered_on: Date;

    @Prop({ default: 'USER' })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);