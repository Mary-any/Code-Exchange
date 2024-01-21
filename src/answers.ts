// Importeer configuraties en modules
import "./config";
import { api, session } from "@hboictcloud/api";
import { User } from "./models/user";

// Definieer een interface om het formuliermodel te representeren
interface FormModel {
    checkboxYes: boolean;
    checkboxNo: boolean;
}

console.log("Loaded");

let questionId: string | null = null;
let answersList: HTMLElement | null = null;

// Wacht tot het DOM geladen is
// document.addEventListener("DOMContentLoaded", () => {
console.log("DOMContentLoaded event triggered");

// Functie voor het indienen van antwoorden
async function submitAnswer(event: Event): Promise<void> {

    console.log("Submit button clicked");
    event.preventDefault();

    // Haal het antwoord op uit het tekstveld
    const answerTextElement: HTMLTextAreaElement | null = document.getElementById("answerText") as HTMLTextAreaElement | null;
    if (!answerTextElement) {
        console.error("answerTextElement not found!");
        return;
    }
    const answerText: string = answerTextElement.value;

    // Haal informatie op uit verborgen velden
    const answerDateElement: HTMLInputElement | null = document.getElementById("answerDate") as HTMLInputElement | null;
    const answerVotesElement: HTMLInputElement | null = document.getElementById("answerVotes") as HTMLInputElement | null;

    if (!answerDateElement || !answerVotesElement) {
        console.error("One or more hidden fields not found!");
        return;
    }

    // Haal userId en questionId op uit de sessie
    const userId: string | null = session.get("userId");
    const questionId: string | null = session.get("questionId");
    
    console.log("User information:", session.get("user"));

    console.log("Raw userId from session:", userId);

    if (userId && userId.trim() !== "" && !isNaN(Number(userId))) {
        const numericUserId: number = parseInt(userId, 10);

        console.log("userId: (numeric):", userId);
        console.log("questionId:", questionId);

        // Controleer of userId en questionId aanwezig zijn
        if (!userId || !questionId) {
            console.error("userId or questionId not found in session!");
            return;
        }



        // Haal antwoorddatum en stemmen op
        const answerDate: string = answerDateElement.value;
        const answerVotes: string = answerVotesElement.value;

        // Stel antwoord geaccepteerd in op false
        const answerAccepted: boolean = false;

        // Haal de checkbox-elementen op
        const checkboxYes: HTMLInputElement | null = document.getElementById("checkboxYes") as HTMLInputElement | null;
        const checkboxNo: HTMLInputElement | null = document.getElementById("checkboxNo") as HTMLInputElement | null;

        if (!checkboxYes || !checkboxNo) {
            console.error("One or more checkbox elements not found!");
            return;
        }

        // Maak een object met het formuliermodel op basis van de checkbox-statussen
        const formData: FormModel = {
            checkboxYes: checkboxYes.checked,
            checkboxNo: checkboxNo.checked,
        };

        console.log(formData);

        // Log de ingediende antwoordinformatie
        console.log("Answer has been submitted:", {
            userId,
            questionId,
            answerText,
            answerDate,
            answerAccepted,
            answerVotes,
        });

        // Stuur het antwoord naar de database
        try {
            const query: string = "INSERT INTO answer (userId, questionId, answer, answerDate, answerAccepted, answerVotes) VALUES (?, ?, ?, ?, ?, ?)";
            await api.queryDatabase(query, userId, questionId, answerText, answerDate, answerAccepted, answerVotes);
            console.log("Answer successfully inserted into the database");

            // Optionally, update the UI without refreshing the page
            const answersList: HTMLElement | null = document.getElementById("answersList");
            if (answersList) {
                const answerParagraph: HTMLParagraphElement = document.createElement("p");
                answerParagraph.textContent = answerText;

                const listItem: HTMLLIElement = document.createElement("li");
                listItem.appendChild(answerParagraph);
                answersList.appendChild(listItem);
            }
        } catch (error) {
            console.error("Error inserting answer into the database:", error);
        }
    } else {
        console.error("Invalid userId format");
        console.log("userId:", userId);
       
        console.log("!isNaN(Number(userId)):", !isNaN(Number(userId)));
    }
    // Wis het tekstveld na het indienen
    answerTextElement.value = "";
}

// Voeg een klikgebeurtenis toe aan de knop
const submitButton: HTMLButtonElement | null = document.getElementById("submitAnswerButton") as HTMLButtonElement | null;
if (submitButton) {
    submitButton.addEventListener("click", submitAnswer);
} else {
    console.error("submitButton not found!");
}



questionId = new URLSearchParams(window.location.search).get("id");

// Haal het input-element op voor answerVotes
const answerVotesInput: HTMLInputElement | null = document.getElementById("answerVotes") as HTMLInputElement | null;

// Controleer of het element is gevonden
if (answerVotesInput) {
    // Voeg een event listener toe voor het geval de waarde van het inputveld verandert
    answerVotesInput.addEventListener("input", (event) => {
        // Haal de huidige waarde van het inputveld op
        const currentVotes: number = parseInt(answerVotesInput.value, 10);

        // Doe iets met de waarde, bijvoorbeeld loggen naar de console
        console.log("Huidige waarde van answerVotes:", currentVotes);
    });
} else {
    console.error("answerVotes input element niet gevonden!");
}

// Haal de formulier- en checkbox-elementen op
const form: HTMLFormElement = document.getElementById("answerAccepted")! as HTMLFormElement;
const checkboxYes: HTMLInputElement = document.getElementById("checkboxYes")! as HTMLInputElement;
const checkboxNo: HTMLInputElement = document.getElementById("checkboxNo")! as HTMLInputElement;

// Voeg een event listener toe aan het formulier voor het indienen
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Voorkom standaardgedrag van formulierindiening

    // Maak een object met het formuliermodel op basis van de checkbox-statussen
    const formData: FormModel = {
        checkboxYes: checkboxYes.checked,
        checkboxNo: checkboxNo.checked
    };

    // Doe iets met de formData, bijvoorbeeld stuur het naar de server of voer andere logica uit
    console.log(formData);

    // Hier kun je verdere logica toevoegen, zoals het versturen van de formData naar de server.
});


// Get questionId from URL parameters
questionId = new URLSearchParams(window.location.search).get("id");


if (questionId) {
    try {
        // Use the questionId to fetch the question details from the database
        const questionDetails: any[] = await api.queryDatabase("SELECT * FROM question WHERE questionId = ?", [questionId]) as any[];

        // Use the questionId to fetch associated answers
        const answers: any[] = await api.queryDatabase("SELECT * FROM answer WHERE questionId = ?", [questionId]) as any[];

        // Set question details on the page
        const questionTextElement: HTMLTextAreaElement | null = document.getElementById("questionText") as HTMLTextAreaElement | null;

        let answersList: HTMLElement | null = document.getElementById("answersList");

        if (questionTextElement && questionDetails && questionDetails.length > 0) {
            questionTextElement.value = questionDetails[0].question;

            // Display associated answers
            if (!answersList) {
                answersList = document.createElement("div"); // create answersList if it doesn't exist
                answersList.id = "answersList";
            }

            if (answers && answers.length > 0) {
                answers.forEach((answer) => {
                    const answerParagraph: HTMLParagraphElement = document.createElement("p");
                    answerParagraph.innerText = answer.answerText;
                    answersList!.appendChild(answerParagraph);  // Notice the "!" after answersList
                });
            }

            // Append or update answersList on the page
            const existingAnswersList: HTMLElement | null = document.getElementById("answersList");
            if (existingAnswersList) {
                existingAnswersList.replaceWith(answersList);
            } else {
                document.body.appendChild(answersList);
            }
        }


    } catch (error) {
        console.error("Error fetching question details and answers:", error);
    }
}

function getQuestionDetails(): void {

    // Call the function to get question details when the page loads
    document.addEventListener("DOMContentLoaded", () => {
        getQuestionDetails();
    });
}




// Functie voor het instellen van de antwoorddatum
// function setAnswerDate(): void {
//     const today: Date = new Date();
//     const dd: string = String(today.getDate()).padStart(2, "0");
//     const mm: string = String(today.getMonth() + 1).padStart(2, "0");
//     const yyyy: number = today.getFullYear();
//     const hh: number = today.getHours();
//     const min: number = today.getMinutes();
//     const s: number = today.getSeconds();

//     const formattedDate: string = `${yyyy}-${mm}-${dd} ${hh}:${min}:${s}`;
//     const answerDateInput: HTMLInputElement | null = document.getElementById("answerDate") as HTMLInputElement;

//     if (answerDateInput) {
//         answerDateInput.value = formattedDate;
//     }
// }

// // Voeg een klikgebeurtenis toe aan het antwoorddatumveld
// const answerDateElement: HTMLElement | null = document.getElementById("answerDate");
// if (answerDateElement) {
//     answerDateElement.addEventListener("click", setAnswerDate);
// }

