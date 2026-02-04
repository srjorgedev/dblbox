import { Client } from "@libsql/client";

export class RarityRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findAll(lang: string) {
        const query = `
            SELECT 
                r._id as id,
                rt.content as name
            FROM rarity r
            JOIN rarity_texts rt ON r._id = rt.rarity
            WHERE rt.lang = ?
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
                r._id as id,
                rt.content as name
            FROM rarity r
            JOIN rarity_texts rt ON r._id = rt.rarity
            WHERE r._id = ? AND rt.lang = ?
        `;
        const r = await this.db.execute({
            sql: query,
            args: [id, lang]
        });
        return r.rows[0];
    }

}