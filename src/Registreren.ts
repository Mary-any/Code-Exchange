
document.addEventListener("DOMContentLoaded", () => {


    // Selecteer de benodigde elementen
    const eyeIcon: HTMLElement = document.querySelector(".showHidePw") as HTMLElement;
    const passwordField: HTMLElement | null = document.getElementById("registerPassword");
    const confirmPasswordField: HTMLElement | null = document.getElementById("confirmPassword");

    // Controleer of de elementen bestaan voordat je verder gaat
    if (passwordField instanceof HTMLInputElement && confirmPasswordField instanceof HTMLInputElement) {
    // Voeg een klikgebeurtenis toe aan het oogpictogram voor het wachtwoord
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

    function registerUser (): void{

        const registerUsernameInput: HTMLInputElement = document.querySelector("#registerUsername") as HTMLInputElement;
        const registerEmailInput: HTMLInputElement = document.querySelector("#registerEmail") as HTMLInputElement;
        const registerPasswordInput: HTMLInputElement = document.querySelector("#registerPassword") as HTMLInputElement;
        const confirmPasswordInput: HTMLInputElement = document.querySelector("#confirmPassword") as HTMLInputElement;

        if (registerUsernameInput && registerEmailInput && registerPasswordInput && confirmPasswordInput) {
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
                return;
            }
            //Clear the fields
            registerUsernameInput.value = "";
            registerEmailInput.value = "";
            registerPasswordInput.value = "";
            confirmPasswordInput.value = "";
             
        }   
        
        // else {
    
        //     console.error("could not find needed input-field");
        // }
    }


    const Registerbutton: HTMLButtonElement = document.querySelector("#Registerbutton") as HTMLButtonElement;
    if (Registerbutton){
        Registerbutton.addEventListener("click", registerUser);
    } else{
        console.error("cant find Registerbutton");
    } 

    
    
});

