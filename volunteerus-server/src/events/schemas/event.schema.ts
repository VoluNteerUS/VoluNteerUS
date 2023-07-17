import { Type } from "@nestjs/class-transformer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"
import { Question } from "../../questions/schemas/question.schema";
import { Organization } from "../../organizations/schemas/organization.schema";
import { Group } from "../../types/group";

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

    @Prop()
    groupSettings: any[]

    @Prop()
    groups: Group[]

    @Prop()
    defaultHours: number[];

    @Prop({ default: false })
    reminderSent: boolean
}

export const EventSchema = SchemaFactory.createForClass(Event);
