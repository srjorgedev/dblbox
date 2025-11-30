import type { Client } from "@libsql/client";
import { createClient } from "@libsql/client";

export class Database {
    private readonly Conn: Client;

    constructor(url?: string, token?: string) {
        this.Conn = createClient({
            url: url || "file:C:\\Users\\Jorge Sandoval\\Documents\\db\\dblbox.db",
            authToken: token || ""
        });
    }

    getConnection() {
        return this.Conn
    }
}

// interface IDB {
//     read(): Promise<ResultSet>;
//     write(): Promise<ResultSet>;
//     delete(): Promise<ResultSet>;
//     update(): Promise<ResultSet>;
// }
