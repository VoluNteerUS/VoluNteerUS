import { Type } from "@nestjs/class-transformer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Contact } from "src/contacts/schemas/contact.schema";

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
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);