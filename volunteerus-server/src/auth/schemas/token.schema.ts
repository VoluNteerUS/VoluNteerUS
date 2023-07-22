import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type TokenDocument = Token & Document

@Schema()
export class Token {
    @Prop({ 
      type: String,
      required: true, 
    })
    token: string;

    @Prop({ 
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    })
    user_id: string;

    @Prop({ 
      type: Date,
      default: Date.now,
      expires: 3600, 
    })
    created_at: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);