// user.ts
export class User {
    private userId: string;
    private username: string;

    constructor(userId: string, username: string) {
        this.userId = userId;
        this.username = username;
    }

    getUserId(): string {
        return this.userId;
    }

    getUsername(): string {
        return this.username;
    }
}
