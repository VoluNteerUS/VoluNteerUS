import { Type } from "@nestjs/class-transformer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"
import { Question } from "src/questions/schemas/question.schema";
import { Organization } from "src/organizations/schemas/organization.schema";

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
    category: string[]

    @Prop()
    signup_by: Date

    @Prop()
    description: string

    @Prop()
    image_url: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Question.name })
    @Type(() => Question)
    questions: Question
}

export const EventSchema = SchemaFactory.createForClass(Event);
