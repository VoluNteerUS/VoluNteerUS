import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "@nestjs/class-transformer";
import { User } from "../../users/schemas/user.schema";
import mongoose from "mongoose";

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Type(() => User)
    user: User

    @Prop({ required: true })
    message: string

    @Prop({ default: Date.now })
    timestamp: Date
    
    @Prop({ default: false })
    read: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);