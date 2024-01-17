// answer.ts
export class Answer {
    private answerId: string;
    private userId: string;
    private answerText: string;

    public constructor(answerId: string, userId: string, answerText: string) {
        this.answerId = answerId;
        this.userId = userId;
        this.answerText = answerText;
    }

    private getAnswerId(): string {
        return this.answerId;
    }

    private getUserId(): string {
        return this.userId;
    }

    public getAnswerText(): string {
        return this.answerText;
    }
}
