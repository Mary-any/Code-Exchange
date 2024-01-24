// Import configurations and modules
import "./config";
import { api, session } from "@hboictcloud/api";

// Define an interface to represent the form model
interface FormModel {
    checkboxYes: boolean;
    checkboxNo: boolean;
}

console.log("Loaded");

// Get userId from session
const userId: number | undefined = session.get("user") as number | undefined;
let questionId: string | null = null;

// Check if userId is defined before parsing
if (userId !== undefined) {
    const numericUserId: number = userId;

    console.log("User ID for answer submission:", numericUserId);

    // Ensure userId is present
    if (!isNaN(numericUserId)) {
        try {
            // Example declarations (replace these with your actual declarations)
            let answerSnippet: string | null = null;
            let answerText: string = "";
            let answerDate: string = "";
            let answerAccepted: boolean = false;
            let answerVotes: string = "";

            // Convert numericUserId to string here
            const userIdString: string = String(numericUserId);

            // Define query parameters
            const queryParams: any[] = answerSnippet
                ? [userIdString, questionId, answerText, answerDate, answerAccepted, answerVotes, answerSnippet]
                : [userIdString, questionId, answerText, answerDate, answerAccepted, answerVotes];

            // Insert answer into the database
            await api.queryDatabase(
                answerSnippet
                    ? "INSERT INTO answer (userId, questionId, answer, answerDate, answerAccepted, answerVotes, answerSnippet) VALUES (?, ?, ?, ?, ?, ?, ?)"
                    : "INSERT INTO answer (userId, questionId, answer, answerDate, answerAccepted, answerVotes) VALUES (?, ?, ?, ?, ?, ?)",
                ...queryParams
            );

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

            // Clear the text fields after submission
            answerText = "";
            if (answerSnippet !== null) {
                answerSnippet = "";
            }
        } catch (error) {
            console.error("Error inserting answer into the database:", error);
        }
    } else {
        console.error("Numeric user ID is NaN. Handle this case appropriately.");
        // ... (handle the case where userId is not a valid number)
    }
} else {
    console.error("User ID not found in the session in answers.ts.");
    // ... (handle the case where userId is not available)
}

// Wait for the DOM to be loaded
console.log("DOMContentLoaded event triggered");

async function submitAnswer(event: Event): Promise<void> {
    console.log("Submit button clicked");
    event.preventDefault();

    // Get form elements
    const answerTextElement: HTMLTextAreaElement | null = document.getElementById("answerText") as HTMLTextAreaElement | null;
    const answerVotesElement: HTMLInputElement | null = document.getElementById("answerVotes") as HTMLInputElement | null;
    const checkboxYes: HTMLInputElement | null = document.getElementById("checkboxYes") as HTMLInputElement | null;
    const checkboxNo: HTMLInputElement | null = document.getElementById("checkboxNo") as HTMLInputElement | null;
    const answerSnippetElement: HTMLInputElement | null = document.getElementById("answerSnippet") as HTMLInputElement | null;

    // Ensure elements are found
    if (!answerTextElement || !answerVotesElement || !checkboxYes || !checkboxNo) {
        console.error("One or more elements not found!");
        return;
    }

    // Get values from form elements
    const answerText: string = answerTextElement.value;
    const answerVotes: string = answerVotesElement.value;
    const answerDate: string = new Date().toISOString().slice(0, 19).replace("T", " ");
    const answerAccepted: string = checkboxYes.checked ? "yes" : "no";
    const answerSnippet: string | null = answerSnippetElement ? answerSnippetElement.value : null;

    // Get user information from session
    const loggedInUserId: number | undefined = session.get("user");
    console.log("User ID for answer submission:", loggedInUserId);

    // Ensure userId is present
    if (loggedInUserId) {
        // Parse userId as a number
        const numericUserId: number = loggedInUserId;

        console.log("Type of numericUserId:", typeof numericUserId);
        console.log("Value of numericUserId:", numericUserId);

        if (isNaN(numericUserId)) {
            console.error("Numeric user ID is NaN. Handle this case appropriately.");
            return;
        }

        try {
            // Define query parameters
            const queryParams: any[] = answerSnippet
                ? [numericUserId, questionId, answerText, answerDate, answerAccepted, answerVotes, answerSnippet]
                : [numericUserId, questionId, answerText, answerDate, answerAccepted, answerVotes];

            // Insert answer into the database
            await api.queryDatabase(
                answerSnippet
                    ? "INSERT INTO answer (userId, questionId, answer, answerDate, answerAccepted, answerVotes, answerSnippet) VALUES (?, ?, ?, ?, ?, ?, ?)"
                    : "INSERT INTO answer (userId, questionId, answer, answerDate, answerAccepted, answerVotes) VALUES (?, ?, ?, ?, ?, ?)",
                ...queryParams
            );

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

            // Clear the text fields after submission
            answerTextElement.value = "";
            if (answerSnippetElement) {
                answerSnippetElement.value = "";
            }
        } catch (error) {
            console.error("Error inserting answer into the database:", error);
        }
    } else {
        console.error("User ID not found in the session in answers.ts.");
        // ... (handle the case where userId is not available)
    }
}

// Add a click event to the button
const submitButton: HTMLButtonElement | null = document.getElementById("submitAnswerButton") as HTMLButtonElement | null;
if (submitButton) {
    submitButton.addEventListener("click", confirmSubmitAnswer);
} else {
    console.error("submitButton not found!");
}

// Function to confirm before submitting the answer
function confirmSubmitAnswer(event: Event): void {
    // Show a confirmation dialog
    const isConfirmed: boolean = window.confirm("Are you sure you want to submit this answer?");

    // If the user confirms, proceed with submitting the answer
    if (isConfirmed) {
        submitAnswer(event);
    }
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
    console.error("Question ID not found in the URL parameters.");
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

