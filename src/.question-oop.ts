
import "./config";
import { api, session } from "@hboictcloud/api";

// question.ts
export class Question {
    private questionId: string= "";
    private userId: string;
    private questionText: string;
    private questionDate: string;

    public constructor(userId: string, questionText: string, questionDate: string) {
        this.userId = userId;
        this.questionText = questionText;
        this.questionDate = questionDate;
    }
    
    public save(): void {
        const query: string = "INSERT INTO question (userId, question, questionDate) VALUES ( ?, ?, ?)";
        api.queryDatabase(query, this.userId, this.questionText, this.questionDate);
        console.log("Question has been submitted:", this.questionText);
    } 

    public async load (id: number): Promise<Question> {
        // const query: string= "SELECT * FROM question WHERE questionId= ?";
        const query: string= "SELECT * FROM question ORDER BY questionDate DESC";
        const data: Array<any> = await api.queryDatabase (query, id) as Array<any>;
        console.log(data);
        
        const question : Question = new Question(data[0].userId, data[0].question, data[0].questionDate);
        question.questionId = data[0].questionId;
        return question;
    }

    public getQuestionId(): string {
        return this.questionId;
    }

    private getUserId(): string {
        return this.userId;
    }

    public getQuestionText(): string {
        return this.questionText;
    }
}
