import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type EventDocument = Event & Document;

@Schema()
export class Event {
    @Prop()
    title: string

    @Prop()
    date: Date[]

    @Prop()
    location: string

    @Prop()
    organized_by: string

    @Prop()
    signup_by: Date

    @Prop()
    description: string

    @Prop()
    image_url: string
}

export const EventSchema = SchemaFactory.createForClass(Event);
