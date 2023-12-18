import "./config";
import { api, session } from "@hboictcloud/api";


console.log("script zit te werken");

// functie om data in de html te zetten

async function insert(): Promise<void> {
    try {
        console.log("inside insert...");

        // hier haal ik de question id in de sessie
        const questionId: any = 1; session.get("question");
        console.log("questionId:", questionId);

        // hier haal je de questions op met questionid
        const Question: Question[] | undefined = await getQuestionInfo(questionId);
        console.log("retrieved question:", Question);

        // hier worden de questions in de website gezien dus de element pakken van html
        if (Question) {
            const questionInfo: any = document.getElementById("questionInfo");
            console.log("Question Info Element:", questionInfo);
           
            if (questionInfo) {
                const questionHTML: any =

                    `<h2>questions</h2> 
                    <p>Question: ${Question.question} </p>
                    <p>Date: ${Question.questionDate} </p>`;

                questionInfo.innerHTML = questionHTML;

                questionInfo.style.cursor = "pointer";
                questionInfo.addEventListener("click", async () => {
                    console.log("dic clicked");

                    const allQuestions: Question[] | undefined = await getQuestionInfo(questionId);
                    console.log("All questions:", allQuestions);

                    // Process 'allQuestions' to display them in HTML as needed
                    if (allQuestions) {
                        // Loop through 'allQuestions' and display them in HTML
                        allQuestions.forEach((q) => {
                            // Generate HTML to display 'q' and add it to the page
                            // Example: Create <div> or <p> elements and append them to 'questionInfo'

                        });
                    } else {
                        console.error("No questions retrieved");
                    }
                });

            } else {
                console.error("element with id question info not found");
            }

        } else {
            console.error("no data retrieved");
        }
    } catch (error) {
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
    questionId: number;
    question: string;
    questionSnippet: string;
    questionDate: number;

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



