import { Client } from "@libsql/client";

export class TypeRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findAll(lang: string) {
        const query = `
            SELECT 
                t._id as id,
                tt.content as name
            FROM type t
            JOIN type_texts tt ON t._id = tt.type
            WHERE tt.lang = ?
        `;
        const r = await this.db.execute({
            sql: query,
            args: [lang]
        });
        return r.rows;
    }

    async findByID(id: number, lang: string) {
        const query = `
            SELECT 
                t._id as id,
                tt.content as name
            FROM type t
            JOIN type_texts tt ON t._id = tt.type
            WHERE t._id = ? AND tt.lang = ?
        `;
        const r = await this.db.execute({
            sql: query,
            args: [id, lang]
        });
        return r.rows[0];
    }

}