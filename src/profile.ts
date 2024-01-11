/* eslint-disable @typescript-eslint/typedef */
import "./config";
import { api, session } from "@hboictcloud/api";
 

document.addEventListener("DOMContentLoaded", async function () {
    const ingelogdeGebruiker = session.get("user");
 
    const nameElement: HTMLSpanElement | null = document.querySelector("#name");

    const users: any = await api.queryDatabase("SELECT * FROM user WHERE userId = ? ", ingelogdeGebruiker );

    console.log (users);
    if (nameElement) {
        if ( users[0].username ) {
            nameElement.textContent = users[0].username;
            console.log("zie naam van username");
        } else {
            console.error("Gebruikersnaam niet gevonden in de lokale opslag.");
        }
    } else {
        console.error("Element met ID 'username' niet gevonden.");
    }
});

 
const users: Array<any> = await api.queryDatabase("SELECT * FROM user") as Array<any>;

 
if (users.length > 0) {
    for (let i: number = 0; i < users.length; i++) {
        console.log("userId =", users[i].userId);
        console.log("userName =", users[i].username);
    }
} else {
    console.log("Probeer het nog eens");
}