import "./config";
import { api, session } from "@hboictcloud/api";
import { User } from "./models/user";

document.addEventListener("DOMContentLoaded", () => {
    async function submitQuestion(event: Event): Promise<void> {
        event.preventDefault();

        const questionTextElement: HTMLTextAreaElement | null = document.getElementById("questionText") as HTMLTextAreaElement | null;
        const questionSnippetElement: HTMLInputElement | null = document.getElementById("questionSnippet") as HTMLInputElement | null;
        const questionDateElement: HTMLInputElement | null = document.getElementById("questionDate") as HTMLInputElement | null;

        if (!questionTextElement || !questionSnippetElement || !questionDateElement) {
            console.error("One or more fields not found!");
            return;
        }

        const userId: string = session.get("user");
        console.log (userId);

        const queryUser: string = "SELECT username, firstname FROM `user` WHERE `id`= ?";
        
        

        // const userId: string = session.get("user");
        
        const questionText: string = questionTextElement.value;
        const questionSnippet: string = questionSnippetElement.value;
        const questionDate: string = questionDateElement.value;

        // Add the question to the list (for demonstration purposes)
        const questionsList: HTMLElement | null = document.getElementById("questionsList");
        if (questionsList) {
            const questionParagraph: HTMLParagraphElement = document.createElement("p");
            questionParagraph.textContent = questionText;

            const listItem: HTMLLIElement = document.createElement("li");
            listItem.appendChild(questionParagraph);
            questionsList.appendChild(listItem);
        }

        console.log("Question submitted:", questionText);
        console.log("Additional information:", {
            questionSnippet,
            questionDate,
        });

        questionTextElement.value = "";
        questionSnippetElement.value = "";

        // Add the question to the database
        const query: string = "INSERT INTO question (userId, question, questionDate) VALUES ( ?, ?, ?)";
        api.queryDatabase(query, userId, questionText, questionDate);
        console.log("Question has been submitted:", questionText);
    }

    const submitButton: HTMLButtonElement | null = document.getElementById("submitQuestionButton") as HTMLButtonElement | null;
    if (submitButton) {
        submitButton.addEventListener("click", submitQuestion);
    } else {
        console.error("submitButton not found!");
    }
});

function setQuestionDate(): void {
    const today: Date = new Date();
    const dd: string = String(today.getDate()).padStart(2, "0");
    const mm: string = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy: number = today.getFullYear();
    const hh: number = today.getHours();
    const min: number = today.getMinutes();
    const s: number = today.getSeconds();

    const formattedDate: string = `${yyyy}-${mm}-${dd} ${hh}:${min}:${s}`;
    const questionDateInput: HTMLInputElement | null = document.getElementById("questionDate") as HTMLInputElement;

    if (questionDateInput) {
        questionDateInput.value = formattedDate;
    }
}

// Voeg een klikgebeurtenis toe aan het antwoorddatumveld
const questionDateElement: HTMLElement | null = document.getElementById("questionDate");
if (questionDateElement) {
    questionDateElement.addEventListener("click", setQuestionDate);
}