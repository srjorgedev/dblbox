import type { Client } from "@libsql/client";
import { createClient } from "@libsql/client";
import { log } from "../utils/log";

export class Database {
    private readonly Conn: Client;

    constructor(url?: string, token?: string) {
        this.Conn = createClient({
            url: url || "file:C:\\Users\\Jorge Sandoval\\Desktop\\PP\\dblboxv5\\data\\db\\dblbox.db",
            authToken: token || ""
        });
    }

    getConnection() {
        log("[DB]: Connected to database.")
        return this.Conn
    }
}

// interface IDB {
//     read(): Promise<ResultSet>;
//     write(): Promise<ResultSet>;
//     delete(): Promise<ResultSet>;
//     update(): Promise<ResultSet>;
// }
