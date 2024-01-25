/* eslint-disable @typescript-eslint/typedef */
import "./config";
import { User } from "./user-oop";
import { api, session, url } from "@hboictcloud/api";

document.addEventListener("DOMContentLoaded", () => {


    //Eye Icon
    const eyeIcon: HTMLElement = document.querySelector(".showHidePw") as HTMLElement;
    const passwordField: HTMLElement | null = document.getElementById("registerPassword");
    const confirmPasswordField: HTMLElement | null = document.getElementById("confirmPassword");


    if (passwordField instanceof HTMLInputElement && confirmPasswordField instanceof HTMLInputElement) {
    
        eyeIcon.addEventListener("click", () => {
            confirmPasswordField.type = confirmPasswordField.type === "password" ? "text" : "password";
        });

        // Voeg een invoergebeurtenis toe aan het wachtwoordveld
        passwordField.addEventListener("input", () => {
            eyeIcon.style.display = passwordField.value !== "" ? "block" : "none";
        });
    } else {
        console.error("Een of beide elementen zijn niet gevonden.");
    };

    // Register User
    function registerUser (): void{

        const registerFirstInput: HTMLInputElement = document.querySelector("#registerFirst") as HTMLInputElement;
        const registerLastInput: HTMLInputElement = document.querySelector("#registerLast") as HTMLInputElement;

        const registerUsernameInput: HTMLInputElement = document.querySelector("#registerUsername") as HTMLInputElement;
        const registerEmailInput: HTMLInputElement = document.querySelector("#registerEmail") as HTMLInputElement;
        
        const registerPasswordInput: HTMLInputElement = document.querySelector("#registerPassword") as HTMLInputElement;
        const confirmPasswordInput: HTMLInputElement = document.querySelector("#confirmPassword") as HTMLInputElement;

        if (registerFirstInput && registerLastInput && registerUsernameInput && registerEmailInput && registerPasswordInput && confirmPasswordInput) {
            
            const registerFirst: string= registerFirstInput.value;
            console.log("Firstname:", registerFirst);

            const registerLast: string= registerLastInput.value;
            console.log("Lastname:", registerLast);

            const registerUsername:  string= registerUsernameInput.value;
            console.log("Username:", registerUsername);
    
            const registerEmail: string = registerEmailInput.value;
            console.log("Email:", registerEmail);
    
            const registerPassword: string = registerPasswordInput.value;
            console.log("Password:", registerPassword);
    
            const confirmPassword: string = confirmPasswordInput.value;
            console.log("Password:", confirmPassword);
    
            if (registerPassword !== confirmPassword) {
                console.error("Password does not match"); 
            }

            // const query: string = "INSERT INTO user (firstname, lastname, username, email, password ) VALUES ( ?, ?, ?, ?, ? )";
            // api.queryDatabase(query, registerFirst, registerLast, registerUsername, registerEmail, registerPassword, );
            // console.log("user has been created", registerFirst, registerLast, registerUsername, registerEmail, registerPassword,);
            const user: User= new User( null, registerUsername, registerPassword, registerEmail, registerFirst, registerLast, null, null, null);

            user.save();

            alert("Account Registered!");


            //Clear the fields
            registerFirstInput.value = "";
            registerLastInput.value = "";
            registerUsernameInput.value = "";
            registerEmailInput.value = "";
            registerPasswordInput.value = "";
            confirmPasswordInput.value = "";

            
             
        }   
        
    }


    const Registerbutton: HTMLButtonElement = document.querySelector("#Registerbutton") as HTMLButtonElement;
    if (Registerbutton){
        Registerbutton.addEventListener("click", registerUser);
    } else{
        console.error("cant find Registerbutton");
    } 
    


});


document.addEventListener("DOMContentLoaded", () => {
    const toggleVisionImpairedButton: HTMLElement | null = document.getElementById("toggleVisionImpaired");
    const readPageButton: HTMLElement | null = document.getElementById("readPageButton");

    // Voeg klikgebeurtenis toe aan de knop
    if (toggleVisionImpairedButton) {
        toggleVisionImpairedButton.addEventListener("click", () => {
        // Voer hier de logica uit voor het klikken op de toggleVisionImpaired-knop
            console.log("Toggle Vision Impaired button clicked");
            toggleZoom();
        });
    }

    // Voeg klikgebeurtenis toe aan de knop voor Read Page
    if (readPageButton) {
        readPageButton.addEventListener("click", () => {
            console.log("Read Page button clicked");
            speak("Fill in all your details on the registration page");
        });
    }

    function toggleZoom(): void {
    // Voeg hier de logica toe voor het in- en uitzoomen van de pagina
        const currentZoom: number = parseFloat((document.body.style as any).zoom) || 1.0;
        const newZoom: number = currentZoom === 1.0 ? 1.2 : 1.0; // Aangepaste zoomwaarde
        (document.body.style as any).zoom = newZoom.toString();
    }

    function speak(text: string): void {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speechSynthesis.speak(speech);
    }

});
