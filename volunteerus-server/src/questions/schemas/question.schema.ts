import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
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
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
