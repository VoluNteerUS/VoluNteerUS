import { Type } from "@nestjs/class-transformer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Contact } from "../../contacts/schemas/contact.schema";
import { User } from "../../users/schemas/user.schema";

export type OrganizationDocument = Organization & Document;

@Schema()
export class Organization {
    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true })
    description: string;
    
    @Prop()
    image_url: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Contact.name })
    @Type(() => Contact)
    contact: Contact;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
    committee_members: User[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);