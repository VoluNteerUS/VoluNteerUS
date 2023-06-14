import { Event } from "src/events/schemas/event.schema";
import { User } from "src/users/schemas/user.schema";

export class CreateResponseDto {
    event: Event;
    user: User;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    status: string;
    submitted_on: Date;
}
