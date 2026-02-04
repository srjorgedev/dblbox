import { Client } from "@libsql/client";

export class ColorRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findAll(lang: string) {
        const query = `
            SELECT 
                c._id as id,
                ct.content as name
            FROM color c
            JOIN color_texts ct ON c._id = ct.color
            WHERE ct.lang = ?
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
                c._id as id,
                ct.content as name
            FROM color c
            JOIN color_texts ct ON c._id = ct.color
            WHERE c._id = ? AND ct.lang = ?
        `;
        const r = await this.db.execute({
            sql: query,
            args: [id, lang]
        });
        return r.rows[0];
    }

}