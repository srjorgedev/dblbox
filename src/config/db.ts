import { Client, createClient } from "@libsql/client";

class Database {
    private readonly Conn: Client;

    constructor(url: string, token?: string) {
        this.Conn = createClient({
            url: url,
            authToken: token
        });
    }

    getConnection() {
        return this.Conn
    }
}

export default Database;
