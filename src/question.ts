import "./config";
import { api, session } from "@hboictcloud/api";


console.log("script zit te werken");

// functie om data in de html te zetten

async function insert(): Promise<void> {
    try {
        console.log("inside insert...");

        // hier haal ik de question id in de sessie
        const questionId: any = session.get("question");
        console.log("questionId:", questionId);

        // hier haal je de questions op met questionid
        const question: question | undefined = await getQuestionInfo(questionId);
        console.log("retrieved question:", question);
        
        // hier worden de questions in de website gezien dus de element pakken van html
        if (question) {
            const questionInfo: any = document.getElementById("questionInfo");
            console.log("Question Info Element:", questionInfo);

            if (questionInfo) {
                const questionHTML: any =

                    `<h2>question Information</h2> 
                    <p>ID: ${question.questionId} </p>
                    <p>Question: ${question.question} </p>
                    <p>Snippet: ${question.questionSnippet} </p>
                    <p>Date: ${question.questionDate} </p>`;

                questionInfo.innerHTML = questionHTML;

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

// geeft value aan een question
interface question {
    questionId: number;
    question: string;
    questionSnippet: string;
    questionDate: number;
    
}


// hier haalt het de question info op van de database
async function getQuestionInfo(questionId: number): Promise<question | undefined> {
    try {
        console.log("getting question info for questionId:", questionId);
        // hier vraagt hij de database om de info op te halen met behulp van question id
        const data: any = await api.queryDatabase("SELECT * FROM question WHERE questionid = ?", questionId);
        console.log("Retrieved data:", data);
        
        
        if (data.length > 0) {
            // alle info in question doen
            const question: question = {
                questionId: data[0]["questionId"],
                question: data[0]["question"],
                questionSnippet: data[0]["questionSnippet"],
                questionDate: data[0]["questionDate"],
            };
            //pakt data en doet het in query
            console.log("formatted question", question);
            return question;

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
