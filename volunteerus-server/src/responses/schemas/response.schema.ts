import { Type } from "@nestjs/class-transformer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Event } from "src/events/schemas/event.schema";
import { User } from "src/users/schemas/user.schema";

export type ResponseDocument = Response & Document;

@Schema()
export class Response {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Event.name })
    @Type(() => Event)
    event: Event

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Type(() => User)
    user: User

    @Prop()
    1: string;
    
    @Prop()
    2: string;
    
    @Prop()
    3: string;

    @Prop()
    4: string;
    
    @Prop()
    5: string;
    
    @Prop()
    6: string;

    @Prop({ default: "Pending" })
    status: string;

    @Prop()
    submitted_on: Date;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
