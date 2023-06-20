import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ContactDocument = Contact & Document

@Schema()
export class Contact {
    @Prop({ required: true })
    email: string;

    @Prop({
        default: [],
        type: [{
            platform: { type: String }, 
            url: { type: String }   
        }]
    })
    social_media: {
        platform: string;
        url: string;
    }[];
}

export const ContactSchema = SchemaFactory.createForClass(Contact);