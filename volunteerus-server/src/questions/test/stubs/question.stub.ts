import { Question } from "src/questions/schemas/question.schema";

export const questionStub = (): Question => {
    return {
        1: ["Test Question 1", "Open Ended"],
        2: ["Test Question 2", "MCQ"],
        3: ["Test Question 3", "MCQ"],
        4: ["Test Question 4", "MCQ"],
        5: ["Test Question 5", "MCQ"],
        6: ["Test Question 6", "MCQ"],
    }
}

export const updatedQuestionStub = (): Question => {
    return {
        1: ["Test Question 1", "Open Ended"],
        2: ["Test Question 2", "MCQ"],
        3: ["Test Question 3", "MCQ"],
        4: ["Test Question 4", "MCQ"],
        5: ["Test Question 5", "MCQ"],
        6: []
    }
}
