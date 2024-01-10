// question.ts
export class Question {
    private questionId: string;
    private userId: string;
    private questionText: string;

    constructor(questionId: string, userId: string, questionText: string) {
        this.questionId = questionId;
        this.userId = userId;
        this.questionText = questionText;
    }

    getQuestionId(): string {
        return this.questionId;
    }

    getUserId(): string {
        return this.userId;
    }

    getQuestionText(): string {
        return this.questionText;
    }
}