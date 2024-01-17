import "./config";
import { api, session } from "@hboictcloud/api";

console.log("script zit te werken");

async function getUserById(userId: number): Promise<string | undefined> {
    try {
        const userData: any = await api.queryDatabase("SELECT username FROM user WHERE userId = ?", [userId]);
        if (userData && userData.length > 0) {
            return userData[0].username;
        } else {
            console.warn("No user found for userId:", userId);
            return undefined;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return undefined;
    }
}

async function insert(): Promise<void> {
    try {
        console.log("inside insert...");

        // hier haal ik de question id in de sessie
        const questionId: any = session.get("question");
        console.log("questionId:", questionId);

        // hier haal je de questions op met questionid
        const Question: Question[] | undefined = await getQuestions();
        console.log("retrieved question:", Question);

        // hier worden de questions in de website gezien dus de element pakken van html
        const questionsContainer: HTMLElement | null = document.getElementById("questionInfo");

        if (questionsContainer) {
            const Question: Question[] | undefined = await getQuestions();

            if (Question && Question.length > 0 && questionsContainer) {
                

                for (let i: number = 0; i < Question.length; i++) {
                    const questionDiv: HTMLDivElement = document.createElement("div");
                    questionDiv.classList.add("question-container");

                    const question: Question = {
                        userId: Question[i]["userId"],
                        questionId: Question[i]["questionId"],
                        question: Question[i]["question"],
                        questionSnippet: Question[i]["questionSnippet"],
                        questionDate: Question[i]["questionDate"],
                    };

                    const username: string | undefined = await getUserById(question.userId);
                    const questionInfo: any = await getQuestionInfo(Question[i].questionId);
                    console.log("Question Info Element:", questionInfo);

                    if (questionInfo && username) {
                        const questionHTML: string =
                            `<div class="question">
                <h2>Question ${i + 1}</h2>
                <p>User: ${username}</p>
                <p>Question: ${Question[i].question}</p>
                <p>Date: ${Question[i].questionDate}</p>
            </div>`;

                        questionDiv.innerHTML = questionHTML;

                        // Add click event listener to each question
                        questionDiv.addEventListener("click", () => {
                            // Set session data for the clicked question
                            session.set("questionId", Question[i].questionId);
                            // Redirect to answer.html
                            window.location.href = `/answer.html?id=${Question[i].questionId}`;
                        });

                        // Append the questionDiv to questionsContainer after adding the click event listener
                        questionsContainer.appendChild(questionDiv);
                    } else {
                        console.error("No questions retrieved");
                    }
                }

                

            }
        }
    } catch (error: any) {
        console.error(error);
    }
}






// geeft value aan een question
interface Question {
    userId: number
    questionId: number;
    question: string;
    questionSnippet: string;
    questionDate: number;

}

async function getQuestions(): Promise<Question[] | undefined> {

    const data: Array<any> = await api.queryDatabase("SELECT * FROM question") as Array<any>;

    return data;
}

// hier haalt het de question info op van de database
async function getQuestionInfo(questionId: number): Promise<Question[] | undefined> {
    try {
        console.log("getting question info for questionId:", questionId);
        // hier vraagt hij de database om de info op te halen met behulp van question id
        const data: Array<any> = await api.queryDatabase("SELECT * FROM question WHERE questionId  = ?", [questionId]) as Array<any>;
        console.log("Retrieved data:", data);


        if (data.length > 0) {
            const questions: Question[] = [];

            // alle info in question doen

            for (let i: number = 0; i < data.length; i++) {
                const formattedQuestion: Question = {
                    userId: data[i]["userId"],
                    questionId: data[i]["questionId"],
                    question: data[i]["question"],
                    questionSnippet: data[i]["questionSnippet"],
                    questionDate: data[i]["questionDate"],
                };

                questions.push(formattedQuestion);
                //pakt data en doet het in query
                console.log("formatted question", formattedQuestion);

            }
            return questions;
        } else {
            console.warn("no data found", questionId);
            return undefined;
        }
    }


    catch (error) {
        console.error("database query error", error);
        return undefined;
    }




}

// het doet de insert functie
insert();




