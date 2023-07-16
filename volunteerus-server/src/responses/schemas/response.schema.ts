import { Type } from "@nestjs/class-transformer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Event } from "../../events/schemas/event.schema";
import { User } from "../../users/schemas/user.schema";

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
    1: any[];
    
    @Prop()
    2: any[];
    
    @Prop()
    3: any[];

    @Prop()
    4: any[];
    
    @Prop()
    5: any[];
    
    @Prop()
    6: any[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
    selected_users: User[];

    @Prop({ default: "Pending" })
    status: string;

    @Prop()
    submitted_on: Date;

    @Prop()
    attendance: string[];

    @Prop()
    hours: number[];

    @Prop()
    shifts: boolean[];
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
