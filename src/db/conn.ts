import { createClient } from "@libsql/client"
import type { Client, ResultSet } from "@libsql/client"

// const conn = createClient({
//     url: "file:C:\\Users\\Jorge Sandoval\\Documents\\db\\dblbox.sql",
//     offline: true,
// });


class Database {
    public readonly conn: Client;

    constructor() {
        this.conn = createClient({
            url: "file:C:\\Users\\Jorge Sandoval\\Documents\\db\\dblbox.db",
        });
    }
    
    // read(table: string, columns: string[]): Promise<ResultSet> {
    //     const sql = `SELECT ${columns.join(", ")} FROM ${table};`;
    //     return this.conn.execute({ sql });
    // }

    // write(table: string, data: Record<string, unknown>): Promise<ResultSet> {
    //     const sql = `INSERT INTO ${table} (${Object.keys(data).join(", ")}) VALUES (${Object.values(data).map(value => `'${value}'`).join(", ")});`;
    //     return this.conn.execute({ sql });
    // }
}

export const conn = new Database()

// interface IDB {
//     read(): Promise<ResultSet>;
//     write(): Promise<ResultSet>;
//     delete(): Promise<ResultSet>;
//     update(): Promise<ResultSet>;
// }
