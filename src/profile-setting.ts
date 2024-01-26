//Deze typescript is voor de logout knop

import "./config";
import { api, session, url } from "@hboictcloud/api";
import { User } from "./models/user";

/**
 * Deze methode wordt aangeroepen als de pagina is geladen, dat gebeurd helemaal onderin!
 */
async function setup(): Promise<void> {
    // Kijk of de gebruiker is ingelogd anders mag je hier niet komen.
    security();

    // Maak een actie aan voor de logout knop. Als je hier op drukt wordt de logout functie aangeroepen
    document.querySelector(".logout-btn")?.addEventListener("click", logout);

    // Haal alle gegevens van de gebruiker op uit de database en stop dat in het model User
    const user: User | undefined = await getUserInfo(session.get("user"));

    // vul naam is uit het object in de sessie
    if (user) {
        document.querySelector(".name")!.innerHTML = user.firstname + " " + user.lastname;
    }

    
}

/**
 * Check if the user is logged in
 * De methode geeft niets terug (void) en heeft daarom geen return statement
 */
function security(): void {
    // Als de sessie met naam user_id niet bestaat (door de ! werkt de if als nietwaar) dan is de gebruiker niet ingelogd
    if (!session.get("user") || session.get("user") === undefined) {
        // Stuur de gebruiker door naar de login pagina
        url.redirect("homepage.html");
    }
}

/**
 * Haal alle gegevens van de gebruiker op uit de database
 * @param id
 * @returns user object
 */
async function getUserInfo(userid: number): Promise<User | undefined> {
    try {
        const data: any = await api.queryDatabase("SELECT * FROM user WHERE id = ?", userid);

        if (data.length > 0) {
            const user: User = new User(
                data[0]["id"],
                data[0]["username"],
                data[0]["email"],
                data[0]["firstname"],
                data[0]["lastname"]
            );
            return user;
        }
        return undefined;
    } catch (error) {
        

        return undefined;
    }
}

/**
 * Logout van de gebruiker door de sessie te verwijderen
 * De methode geeft niets terug (void) en heeft daarom geen return statement
 */
function logout(): void {
    // Verwijder de sessies
    session.remove("user");
    session.clear();

    // Stuur de gebruiker door naar de login pagina
    url.redirect("homepage.html");
}

// Run bij het opstarten de setup functie
await setup();






// Definieer een interface voor het HTML-element
interface HTMLButtonElementWithClass extends HTMLButtonElement {
    classList: DOMTokenList & {
        contains(name: string): boolean;
        add(...tokens: string[]): void;
        remove(...tokens: string[]): void;
    };
}

// Voeg een eventlistener toe aan het verwijderenButton element
function deleteAccount(): Promise<void> {
    const verwijderenButton: HTMLButtonElementWithClass | null = document.getElementById("verwijderen") as HTMLButtonElementWithClass;
 
    if (verwijderenButton) {
        verwijderenButton.addEventListener("click", async () => {
            try {
                const data: any = await api.queryDatabase("DELETE FROM user WHERE userId = ?", session.get ("user"));
                console.log("Account verwijderd:", data);
                url.redirect("homepage.html");
                alert("Account deleted!");
            } catch (error) {
                console.error("Fout bij het verwijderen van het account:", error);
                
            }
        });
    } else {
        console.error("Knop niet gevonden");
    }
 
    return Promise.resolve(); // Return a promise to satisfy TypeScript
}

deleteAccount();
