import { User } from "src/users/schemas/user.schema"

export class Group {
    number: number
    members: User[]
}