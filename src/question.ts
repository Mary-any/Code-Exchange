import "./config";
import { api, session } from "@hboictcloud/api";


console.log("script zit te werken");

// functie om data in de html te zetten

async function insert(): Promise<void> {
    try {
        console.log("inside insert...");

        // hier haal ik de question id in de sessie
        const questionId: any =  session.get("question");
        console.log("questionId:", questionId);

        // hier haal je de questions op met questionid
        const Question: Question[] | undefined = await getQuestions();
        console.log("retrieved question:", Question);

        // hier worden de questions in de website gezien dus de element pakken van html
        if (Question && Question.length > 0) {
            const questionsContainer: HTMLElement | null = document.getElementById("questionInfo");
            // loop door de array met questions


            for (let i: number = 0; i < Question.length; i++) {
                const question: Question = {
                    userId: Question[i]["userId"],
                    questionId: Question[i]["questionId"],
                    question: Question[i]["question"],
                    questionSnippet: Question[i]["questionSnippet"],
                    questionDate: Question[i]["questionDate"],
                };

                const questionInfo: any = await getQuestionInfo(Question[i].questionId);
                console.log("Question Info Element:", questionInfo);

                if (questionInfo) {
                    const questionsContainer: HTMLElement | null = document.getElementById("questionInfo");
                       
                    if (questionsContainer) {
                        const questionHTML: string= 
                        `<div class="question">
                        <h2>Question ${i + 1}</h2>
                        <p>Question: ${Question[i].question}</p>
                        <p>Date: ${Question[i].questionDate}</p>
                    </div>
                `;
                    
                        questionsContainer.innerHTML += questionHTML;
                    }
                    

                } else {
                    console.error("No questions retrieved");
                }



            }

        }
    } catch (error: any) {
        console.error(error);
    }

}

function truncateString(str: string, maxLength: number): string {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + "..."; // Append ellipsis if truncated
    }
    return str;
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
                    userId: data [i] ["userId"],
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

