import "./config";
import { api, session } from "@hboictcloud/api";

// answer.ts

document.addEventListener("DOMContentLoaded", () => {
    async function submitAnswer(event: Event): Promise<void> {
        event.preventDefault();

        const answerTextElement: HTMLTextAreaElement | null = document.getElementById("answerText") as HTMLTextAreaElement | null;
        if (!answerTextElement) {
            console.error("answerTextElement not found!");
            return;
        }
        const answerText: string = answerTextElement.value;

        // Get information from hidden fields
    
        const answerDateElement: HTMLInputElement | null = document.getElementById("answerDate") as HTMLInputElement | null;
        const answerAcceptedElement: HTMLInputElement | null = document.getElementById("answerAccepted") as HTMLInputElement | null;
        const answerVotesElement: HTMLInputElement | null = document.getElementById("answerVotes") as HTMLInputElement | null;

        if ( !answerAcceptedElement || !answerDateElement ||  !answerVotesElement) {
            console.error("One or more hidden fields not found!");
            return;
        }

        // query om met de ID de username te halen uit de database hint: use WHERE
        const userId: string = session.get("user");
        
      
        const answerDate: string = answerDateElement.value;
        // const answerAccepted: string = answerAcceptedElement.value;
        const answerVotes: string = answerVotesElement.value;


        // trying to see if it will work like this?
        const answerAccepted: boolean=false;

        
        // CHECK if answerAccepted == true 

        const answersList: HTMLElement | null = document.getElementById("answersList");
        if (answersList) {
            const answerParagraph: HTMLParagraphElement = document.createElement("p");
            answerParagraph.textContent = answerText;

            const listItem: HTMLLIElement = document.createElement("li");
            listItem.appendChild(answerParagraph);
            answersList.appendChild(listItem);
        }

        console.log("Answer submitted:", answerText);
        console.log("Additional information:", {
            // answerDate,
            answerAccepted,
            answerVotes,
        });

        answerTextElement.value = "";

        // Api datbase

        const query: string = "INSERT INTO answer (userId, questionId, answer, answerDate, answerAccepted, answerVotes) VALUES (?, ?, ?, ?, ?, ?)";
        api.queryDatabase(query,userId, questionId, answerText, answerDate, answerAccepted, answerVotes);
        console.log("Answer has been submitted:",);
    }

    // Button

    const submitButton: HTMLButtonElement | null = document.getElementById("submitAnswerButton") as HTMLButtonElement | null;
    if (submitButton) {
        console.log(submitButton);
        submitButton.addEventListener("click", submitAnswer);
    } else {
        console.error("submitButton not found!");
    }
    
});

// Date and time

function setanswerDateDate(): void {
    const today: Date = new Date();
    const dd: string = String(today.getDate()).padStart(2, "0");
    const mm: string = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy: number = today.getFullYear();
    const hh: number = today.getHours();
    const min: number = today.getMinutes();
    const s:number = today.getSeconds();

    const formattedDate: string = `${yyyy}-${mm}-${dd} ${hh}:${min}:${s}`;
    const answerDateInput: HTMLInputElement | null = document.getElementById("answerDate") as HTMLInputElement;

    if (answerDateInput) {
        answerDateInput.value = formattedDate;
    }
}

const answerDateElement: HTMLElement | null = document.getElementById("answerDate");

if (answerDateElement) {
    answerDateElement.addEventListener("click", setanswerDateDate);
}
