import "./config";
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

            const query: string = "INSERT INTO user (firstname, lastname, username, email, password ) VALUES ( ?, ?, ?, ?, ? )";
            api.queryDatabase(query, registerFirst, registerLast, registerUsername, registerEmail, registerPassword, );
            console.log("user has been created", registerFirst, registerLast, registerUsername, registerEmail, registerPassword,);
        

            //Clear the fields
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

