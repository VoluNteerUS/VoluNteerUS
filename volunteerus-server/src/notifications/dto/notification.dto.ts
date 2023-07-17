import { User } from "../../users/schemas/user.schema";

export class NotificationDto {
    user: User;
    message: string;
    timestamp: Date;
    read: boolean;

    constructor(user: User, message: string, timestamp: Date, read: boolean) {
        this.user = user;
        this.message = message;
        this.timestamp = timestamp;
        this.read = read;
    }
}