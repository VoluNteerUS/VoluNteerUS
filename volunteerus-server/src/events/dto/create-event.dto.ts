import { Organization } from "src/organizations/schemas/organization.schema"
import { Question } from "src/questions/schemas/question.schema"

export class CreateEventDto {
  title: string
  date: Date[]
  location: string
  organized_by: Organization
  category: string[]
  signup_by: Date
  description: string
  image_url: string
  questions: Question
  groupSettings: any[]
  defaultHours: number[]
}
