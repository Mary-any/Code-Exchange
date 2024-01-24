/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */
// /* eslint-disable @typescript-eslint/typedef */
import "./config";
import { api, session } from "@hboictcloud/api";
import { Question } from "./.question-oop";
 
document.addEventListener("DOMContentLoaded", async function () {
    const ingelogdeGebruiker = session.get("user");
 
    const nameElement: HTMLSpanElement | null = document.querySelector("#name");

    const users: any = await api.queryDatabase("SELECT * FROM user WHERE userId = ? ", ingelogdeGebruiker);

    console.log(users);

    if (nameElement) {
        if (users[0]?.username) {
            nameElement.textContent = users[0].username;
            console.log("Zie gebruikersnaam");
        } else {
            console.error("Gebruikersnaam niet gevonden in de lokale opslag.");
        }
    } else {
        console.error("Element met ID 'name' niet gevonden.");
    }

    const profielGebruiker = session.get("user");

    const summaryQElement: HTMLSpanElement | null = document.querySelector("#summaryQ");

    const question: any = await api.queryDatabase("SELECT * FROM question WHERE userId = ? ", profielGebruiker);

    console.log(question);

    if (summaryQElement) {
        if (question.length > 0 && question[0]?.question) {
            // summaryQElement.textContent = question[0].question;
            loadQuestions();
            console.log("Zie vraag van de gebruiker");
        } else {
            console.error("Vraag niet gevonden in de lokale opslag.");
        }
    } else {
        console.error("Element met ID summaryQ' niet gevonden.");
    }

    const questions: Array<any> = await api.queryDatabase("SELECT * FROM question") as Array<any>;

    if (questions.length > 0) {
        for (let i: number = 0; i < questions.length; i++) {
            console.log("userId=", questions[i].userId);
            console.log("question =", questions[i].question);
        }
    } else {
        console.log("Probeer het opnieuw");
    }
});


// Importeer de Profile-klasse
import { Profile } from "./profile-oop";
import { User } from "./user-oop";

// Creëer een instantie van de Profile-klasse met de gebruikers-ID (vervang 'jouwGebruikersId' door de werkelijke ID)
const userProfile = new User(session.get ("user"), null, null, null, null, null);

// Laad de vragen en update de HTML
async function loadQuestions() {
    try {
        // Roep de methode loadQuestions aan om vragen op te halen
        const questions = await userProfile.loadQuestions();

        // Selecteer het ul-element waarin de vragen worden weergegeven
        const questionList = document.getElementById("questionList");

        console.log(questions);
        console.log(questionList);
        
        

        // Controleer of het element bestaat voordat je het gebruikt
        if (questionList instanceof HTMLUListElement) {
            // Voeg elke vraag toe aan de lijst
            questions.forEach((question: string | null) => {
                if (question !== null) {
                    const listItem = document.createElement("li");
                    listItem.textContent = question;
                    questionList.appendChild(listItem);
                }
            });
        } else {
            console.error("Het element met id 'questionList' is geen UL-element of bestaat niet op de pagina.");
        }
    } catch (error) {
        console.error("Fout bij het laden van vragen:", error);
    }
}

// Roep de functie aan om de vragen te laden zodra de DOM is geladen
document.addEventListener("DOMContentLoaded", loadQuestions);

