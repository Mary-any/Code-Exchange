import "./config";
import { api, session } from "@hboictcloud/api";

// hier zet de class van question en wat een question is.
// het is prive zodat er geen veranderingen komen.
// abstractie laat van de questions alleen de gebruikersnaan, tekst en datum
// ook encapsulatie omdat je niet rechtstreeks de userid en questionid kan pakken
// het kan alleen via de methoden.
class Question {
    private userId: number;
    private questionId: number;
    private question: string;
    private questionSnippet: string;
    private questionDate: number;

    // elke keer wanneer je een nieuwe question maakt kijkt het naar hier
    //hier zet je waarde aan de object
    public constructor(userId: number, questionId: number, question: string, questionSnippet: string, questionDate: number) {
        this.userId = userId;
        this.questionId = questionId;
        this.question = question;
        this.questionSnippet = questionSnippet;
        this.questionDate = questionDate;
    }

    // het haalt de username op van de question
    private async getUsername(): Promise<string | undefined> {
        //hier wordt de database query aan de database gevraagd om de username optehalen
        //await wacht voor een reactie
        try {
            const userData: any = await api.queryDatabase("SELECT username FROM user WHERE userId = ?", [this.userId]);
            return userData && userData.length > 0 ? userData[0].username : undefined;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return undefined;
        }
    }

    // deze code haalt de info op van de questions.
    public async getQuestionInfo(): Promise<Question[] | undefined> {
        // het haalt de info van de questionid op met een database query.
        try {
            console.log("getting question info for questionId:", this.questionId);
            const data: Array<any> = await api.queryDatabase("SELECT * FROM question WHERE questionId  = ?", [this.questionId]) as Array<any>;
            console.log("Retrieved data:", data);

            if (data.length > 0) {
                const questions: Question[] = [];

                for (let i: number = 0; i < data.length; i++) {
                    // het loopt zodat je meerdere questions ziet inplaats van 1.
                    const formattedQuestion: Question = new Question(
                        data[i]["userId"],
                        data[i]["questionId"],
                        data[i]["question"],
                        data[i]["questionSnippet"],
                        data[i]["questionDate"]
                    );

                    questions.push(formattedQuestion);
                    console.log("formatted question", formattedQuestion);
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
    // deze code laat in de html zien wat in een question zit.
    public async renderQuestion(): Promise<string> {
        try {
            const username: string | undefined = await this.getUsername();
            // de html hier wordt gezet in de homepage met de gegevens van de question
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
    // questionid wordt terug gezet in de questions
    public getQuestionId(): number {
        return this.questionId;
    }
}


async function insert(): Promise<void> {
    try {
        //hier wordt de insertfunctie uitgevoerd
        console.log("inside insert...");
        // deze code haalt de vragen op maakt divs en zet ze in de html.
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
                    // hier wordt er html voor elke vraag gemaakt.
                    const questionHTML: string = await question.renderQuestion();
                    questionDiv.innerHTML = questionHTML;

                    // dit maakt de questions clickable en stuurt het door naar answerhtml
                    questionDiv.addEventListener("click", async () => {
                        session.set("questionId", question.getQuestionId());
                        window.location.href = `/answer.html?id=${question.getQuestionId()}`;
                    });

                    // de div wordt toegevoegd aan de homepage
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
    // databasequery wordt gebruikt om vragen van database optehalen
    const data: Array<any> = await api.queryDatabase("SELECT * FROM question") as Array<any>;
    // de gegevens wordt omgezet naar een array van questions
    return data.map((item: any) => new Question(item.userId, item.questionId, item.question, item.questionSnippet, item.questionDate));
}

insert();
