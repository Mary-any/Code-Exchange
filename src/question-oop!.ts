import "./config";
import { api, session } from "@hboictcloud/api";
// deze niet verwijdern pls
class Question {
    private userId: number;
    private questionId: number;
    private question: string;
    private questionSnippet: string;
    private questionDate: number;

    public constructor(userId: number, questionId: number, question: string, questionSnippet: string, questionDate: number) {
        this.userId = userId;
        this.questionId = questionId;
        this.question = question;
        this.questionSnippet = questionSnippet;
        this.questionDate = questionDate;
    }

    private async getUsername(): Promise<string | undefined> {
        try {
            const userData: any = await api.queryDatabase("SELECT username FROM user WHERE userId = ?", [this.userId]);
            return userData && userData.length > 0 ? userData[0].username : undefined;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return undefined;
        }
    }

    public async getQuestionInfo(): Promise<Question[] | undefined> {
        try {
            console.log("getting question info for questionId:", this.questionId);
            const data: Array<any> = await api.queryDatabase("SELECT * FROM question WHERE questionId  = ?", [this.questionId]) as Array<any>;

            if (data.length > 0) {
                const questions: Question[] = [];

                for (let i: number = 0; i < data.length; i++) {
                    const formattedQuestion: Question = new Question(
                        data[i]["userId"],
                        data[i]["questionId"],
                        data[i]["question"],
                        data[i]["questionSnippet"],
                        data[i]["questionDate"]
                    );

                    questions.push(formattedQuestion);
                }
                return questions;
            } else {
                console.warn("no data found", this.questionId);
                return undefined;
            }
        } catch (error) {
            console.error("database query error", error);
            return undefined;
        }
    }

    public async renderQuestion(): Promise<string> {
        try {
            const username: string | undefined = await this.getUsername();
            const questionHTML: string =
                `<div class="question">
                    <h2>User: ${username}</h2>
                    <p>Question: ${this.question}</p>
                    <p>Date: ${this.questionDate}</p>
                </div>`;
            return questionHTML;
        } catch (error) {
            console.error("Error rendering question:", error);
            return "<div class='question-error'>Error rendering question</div>";
        }
    }

    public getQuestionId(): number {
        return this.questionId;
    }
}

async function insert(): Promise<void> {
    try {
        console.log("inside insert...");

        const questionId: any = session.get("question");
        console.log("questionId:", questionId);

        const questions: Question[] | undefined = await getQuestions();
        console.log("retrieved questions:", questions);

        const questionsContainer: HTMLElement | null = document.getElementById("questionInfo");

        if (questionsContainer && questions && questions.length > 0) {
            for (let i: number = 0; i < questions.length; i++) {
                const questionDiv: HTMLDivElement = document.createElement("div");
                questionDiv.classList.add("question-container");

                const question: Question = questions[i];

                try {
                    const questionHTML: string = await question.renderQuestion();
                    questionDiv.innerHTML = questionHTML;

                    questionDiv.addEventListener("click", async () => {
                        session.set("questionId", question.getQuestionId());
                        window.location.href = `/answer.html?id=${question.getQuestionId()}`;
                    });

                    questionsContainer.appendChild(questionDiv);
                } catch (renderError) {
                    console.error("Error rendering question:", renderError);
                    questionDiv.innerHTML = "<div class='question-error'>Error rendering question</div>";
                }
            }
        }
    } catch (error: any) {
        console.error("Error in insert function:", error);
    }
}

async function getQuestions(): Promise<Question[] | undefined> {
    const data: Array<any> = await api.queryDatabase("SELECT * FROM question") as Array<any>;
    return data.map((item: any) => new Question(item.userId, item.questionId, item.question, item.questionSnippet, item.questionDate));
}

insert();
