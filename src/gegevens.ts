import "./config";
import { api, session, url } from "@hboictcloud/api";
import { User } from "./user-oop";

const user: User = new User(session.get("user"), null, null, null, null, null, null, null, null);

const username: any = document.getElementById("username");
const firstname: any = document.getElementById("firstName");
const lastname: any = document.getElementById("lastName");
const email: any = document.getElementById("email");
const gender: any = document.getElementById("gender");
const experience: any = document.getElementById("experience");
const birthdate: any = document.getElementById("birthDate");
console.log("Hello");


const saveButton: HTMLButtonElement = document.querySelector("#klik") as HTMLButtonElement;
if (saveButton){
    saveButton.addEventListener("click", function(){
        console.log(birthdate);
        console.log(username);
        
        
        user.setUsername(username.value);
        user.setfirstname(firstname.value);
        user.setlastname(lastname.value);
        user.setemail(email.value);
        user.setdateBirth(birthdate.value);
        user.setgender(gender.value);
        user.setprogramming(experience.value);
        console.log(user);
        

        user.update();
        alert("Changes saved!");

    });
} else{
    console.error("cant find saveButton");


} 
    