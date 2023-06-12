import { Type } from "@nestjs/class-transformer";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Organization } from "src/organizations/schemas/organization.schema";
import { User } from "src/users/schemas/user.schema";

export type CommitteeMemberDocument = CommitteeMember & Document

@Schema()
export class CommitteeMember {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Type(() => User)
    user: User

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Organization.name })
    @Type(() => Organization)
    organization: Organization
}

export const CommitteeMemberSchema = SchemaFactory.createForClass(CommitteeMember);