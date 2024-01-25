import "./config";
import { api, session } from "@hboictcloud/api";

// answer.ts
export class Answer {
    private answerId: string;
    private userId: string;
    private questionId: string;
    private answerText: string;
    private answerDate: string;
    private answerAccepted: boolean;
    private answerVotes: number;
    private answerSnippet: string;

    public constructor(answerId: string, userId: string, questionId: string, answerText: string, answerDate: string, answerAccepted: boolean, answerVotes: number, answerSnippet: string) {
        this.answerId = answerId;
        this.userId = userId;
        this.questionId = questionId;
        this.answerText = answerText;
        this.answerDate = answerDate;
        this.answerAccepted = answerAccepted;
        this.answerVotes = answerVotes;
        this.answerSnippet = answerSnippet;
    }

    public save(): void {
        const query: string = "INSERT INTO answer (answerId, userId, questionId, answer, answerDate, answerAccepted, answerVotes, answerSnippet) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)";
        api.queryDatabase(query, this.answerId, this.userId, this.answerText, this.questionId, this.answerDate, this.answerAccepted, this.answerVotes, this.answerSnippet);
        console.log("Answer has been submitted:", this.answerText);
    }

    public async load (id: number): Promise<Answer> {
        const query: string= "SELECT * FROM answer WHERE answerId= ?";
        const data: Array<any> = await api.queryDatabase (query, id) as Array<any>;
        const answer : Answer = new Answer (data[0].answerId, data[0].userId, data[0].question, data[0].answer, data[0].answerDate, data[0].answerAccepted, data[0].answerVotes, data[0].answerSnippet, );
        answer.answerId = data[0].answer;
        return answer;
    }

    private getAnswerId(): string {
        return this.answerId;
    }

    private getUserId(): string {
        return this.userId;
    }

    private getquestionId(): string {
        return this.questionId;
    }

    public getAnswerText(): string {
        return this.answerText;
    }

    public getanswerDate(): string {
        return this.answerDate;
    }

    public getanswerAccepted(): boolean {
        return this.answerAccepted;
    }

    public getanswerVotes(): number {
        return this.answerVotes;
    }

    private getanswerSnippet(): string {
        return this.answerSnippet;
    }
}
