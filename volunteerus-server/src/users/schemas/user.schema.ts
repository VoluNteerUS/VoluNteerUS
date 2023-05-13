import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop()
    full_name: string;

    @Prop()
    email: string;

    @Prop()
    password: string;

    @Prop({ default: Date.now() })
    registered_on: Date;

    @Prop({ default: 'USER' })
    role: string
}

export const UserSchema = SchemaFactory.createForClass(User);