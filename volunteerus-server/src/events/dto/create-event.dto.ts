import { Question } from "src/questions/schemas/question.schema"

export class CreateEventDto {
  title: string
  date: Date[]
  location: string
  organized_by: string
  category: string[]
  signup_by: Date
  description: string
  image_url: string
  questions: Question;
}
