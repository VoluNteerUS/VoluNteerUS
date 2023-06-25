import mongoose from "mongoose";
import { CreateQuestionDto } from "../../dto/create-question.dto";
import { Question } from "../../schemas/question.schema";
import { UpdateQuestionDto } from "src/questions/dto/update-question.dto";

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

export const questionIdStub = (): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId("5f9d88e5d6a3d5fda0f8a5f2");
}

export const createQuestionDtoStub = (): CreateQuestionDto => {
    return {
        1: ["Test Question 1", "Open Ended"],
        2: ["Test Question 2", "MCQ"],
        3: ["Test Question 3", "MCQ"],
        4: ["Test Question 4", "MCQ"],
        5: ["Test Question 5", "MCQ"],
        6: ["Test Question 6", "MCQ"],
    }
}

export const updateQuestionDtoStub = (): UpdateQuestionDto => {
    return {
        1: ["What is your favourite color?", "Open Ended"],
        2: ["Test Question 2", "MCQ"],
        3: ["Test Question 3", "MCQ"],
        4: ["Test Question 4", "MCQ"],
        5: ["Test Question 5", "MCQ"],
        6: ["Test Question 6", "MCQ"],
    }
}

export const updatedQuestionStub = (): Question => {
    return {
        1: ["What is your favourite color?", "Open Ended"],
        2: ["Test Question 2", "MCQ"],
        3: ["Test Question 3", "MCQ"],
        4: ["Test Question 4", "MCQ"],
        5: ["Test Question 5", "MCQ"],
        6: ["Test Question 6", "MCQ"],
    }
}