import { Event } from "src/events/schemas/event.schema";
import { User } from "src/users/schemas/user.schema";

export class CreateResponseDto {
    event: Event;
    user: User;
    1: any[];
    2: any[];
    3: any[];
    4: any[];
    5: any[];
    6: any[];
    selected_users: User[];
    status: string;
    submitted_on: Date;
}
