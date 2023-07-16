import mongoose from "mongoose"

export class CreateNotificationDto {
    userId: mongoose.Types.ObjectId
    message: string
    timestamp: Date
    read: boolean
}
