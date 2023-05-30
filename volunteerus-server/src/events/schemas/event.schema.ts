import { Type } from "@nestjs/class-transformer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"
import { Organization } from "src/organizations/schemas/organization.schema"

export type EventDocument = Event & Document;

@Schema()
export class Event {
    @Prop()
    title: string

    @Prop()
    date: Date[]

    @Prop()
    location: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Organization.name })
    @Type(() => Organization)
    organized_by: Organization

    @Prop()
    signup_by: Date

    @Prop()
    description: string

    @Prop()
    image_url: string
}

export const EventSchema = SchemaFactory.createForClass(Event);
