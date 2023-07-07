import mongoose from "mongoose";

export class CreateGroupingDto {
    eventId: mongoose.Types.ObjectId;
    groupSize: number;
    groupingType: string;
}