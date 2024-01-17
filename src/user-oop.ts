import "./config";
import { api, session } from "@hboictcloud/api";
// user.ts
export class User {
    private userId: string|null;
    private username: string|null;
    private password: string|null;
    private email: string|null;
    private firstname: string|null;
    private lastname: string|null;


    public constructor(userId: string|null, username: string|null, password: string|null, email: string|null, firstname: string|null, lastname: string|null) {
        this.userId = userId;
        // Als we een userId meegeven (niet null) dan gaan we de user ophalen uit de database
        if (userId !== null) {
            const query: string = "SELECT * FROM user WHERE userId = ?";
            const response: any = api.queryDatabase(query, userId);
            this.username = response.username;
            this.password = response.password;
            this.email = response.email;
            this.firstname= response.firstname;
            this.lastname = response.lastname;

        } else {
            // Anders maken we een nieuwe
            this.username = username;
            this.password = password;
            this.email = email;
            this.firstname= firstname;
            this.lastname = lastname;
        }
    }


    

    public async save(): Promise<any>{
        const query: string = "INSERT INTO user (firstname, lastname, username, email, password ) VALUES ( ?, ?, ?, ?, ? )";
        const response: any = await api.queryDatabase(query, this.firstname, this.lastname, this.username, this.email,  this.password );
        this.userId = response.insertId;
        
        console.log("user has been created", this.firstname, this.lastname,  this.username, this.email, this.password);
    }

    private getUserId(): string|null {
        return this.userId;
    }

    public getUsername(): string|null {
        return this.username;
    }

    public async loadQuestions(): Promise<string[]> {
        console.log("hallo");
        // Haal vragen op uit de database voor de huidige gebruiker
        const query: string = "SELECT question FROM question WHERE userId = ?";
        const data: Array<any> = await api.queryDatabase(query, this.userId) as Array<any>;

        // Maak een array van vraagteksten
        const questions: string[] = data.map((row) => row.question);

        console.log(questions);
        

        return questions;
    }
}
