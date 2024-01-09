// answer.ts
export class Answer {
    private answerId: string;
    private userId: string;
    private answerText: string;

    constructor(answerId: string, userId: string, answerText: string) {
        this.answerId = answerId;
        this.userId = userId;
        this.answerText = answerText;
    }

    getAnswerId(): string {
        return this.answerId;
    }

    getUserId(): string {
        return this.userId;
    }

    getAnswerText(): string {
        return this.answerText;
    }
}
