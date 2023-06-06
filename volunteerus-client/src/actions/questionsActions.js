export const setQuestions = (questions) => {
    return {
        type: "FETCH_QUESTIONS",
        payload: questions
    }
}
