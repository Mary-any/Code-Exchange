// profile.ts
import { api } from "@hboictcloud/api";

export class Profile {
    private userId: string;

    public constructor(userId: string) {
        this.userId = userId;
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
