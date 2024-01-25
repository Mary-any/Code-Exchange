/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */
// /* eslint-disable @typescript-eslint/typedef */
import "./config";
import { api, session } from "@hboictcloud/api";
import { Question } from "./.question-oop";
 
// document.addEventListener("DOMContentLoaded",
document.addEventListener("DOMContentLoaded", showUserName);

async function showUserName () {
    const ingelogdeGebruiker = session.get("user");
 
    const nameElement: HTMLSpanElement | null = document.querySelector("#name");
    const dateBirthElement: HTMLSpanElement | null = document.querySelector("#dateBirth");
    const programmingElement: HTMLSpanElement | null = document.querySelector("#programming");

    const users: any = await api.queryDatabase("SELECT * FROM user WHERE userId = ? ", ingelogdeGebruiker);

    console.log(users);

    if (nameElement && dateBirthElement && programmingElement) {
        if (users[0]?.username) {
            nameElement.textContent = users[0].username;
            console.log("Zie gebruikersnaam");
        } else {
            console.error("Gebruikersnaam niet gevonden in de lokale opslag.");
        }

        if (users[0]?.dateBirth) {
            dateBirthElement.textContent = users[0].dateBirth;
            console.log("Zie geboortedatum");
        } else {
            console.error("Geboortedatum niet gevonden in de lokale opslag.");
        }

        if (users[0]?.programming) {
            programmingElement.textContent = users[0].programming;
            console.log("Zie programmeertaal");
        } else {
            console.error("Programmeertaal niet gevonden in de lokale opslag.");
        }

    } else {
        console.error("Element met ID 'name' niet gevonden.");
    }
};

// Importeer de Profile-klasse
import { Profile } from "./profile-oop";
import { User } from "./user-oop";

// Creëer een instantie van de Profile-klasse met de gebruikers-ID (vervang 'jouwGebruikersId' door de werkelijke ID)
const userProfile = new User(session.get ("user"), null, null, null, null, null, null, null, null);

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

function load(){
    showUserName();
    loadQuestions();
}

// Roep de functie aan om de vragen te laden zodra de DOM is geladen
document.addEventListener("DOMContentLoaded", loadQuestions);


document.addEventListener("DOMContentLoaded", () => {
    const toggleVisionImpairedButton: HTMLElement | null = document.getElementById("toggleVisionImpaired");

    // Voeg klikgebeurtenis toe aan de knop
    if (toggleVisionImpairedButton) {
        toggleVisionImpairedButton.addEventListener("click", () => {
            // Voer hier de logica uit voor het klikken op de toggleVisionImpaired-knop
            console.log("Toggle Vision Impaired button clicked");
            toggleZoom();
        });
    }

    function toggleZoom(): void {
        // Voeg hier de logica toe voor het in- en uitzoomen van de pagina
        const currentZoom: number = parseFloat((document.body.style as any).zoom) || 0.2;
        const newZoom: number = currentZoom === 1.0 ? 1.1 : 1.0; // Aangepaste zoomwaarde
        (document.body.style as any).zoom = newZoom.toString();
    }
    
});
