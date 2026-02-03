import { Client } from "@libsql/client";

export class ChapterRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findAll(lang: string) {
        try {
            const query = `
                SELECT 
                    c._id,
                    ct.content as chapter
                FROM chapter c
                JOIN chapter_texts ct ON c._id = ct.chapter
                WHERE ct.lang = ?
            `;
            const r = await this.db.execute({
                sql: query,
                args: [lang]
            });
            return r.rows;
        } catch (err) {
            throw err;
        }
    }

    async findByID(id: number, lang: string) {
        try {
            const query = `
                SELECT 
                    c._id,
                    ct.content as chapter
                FROM chapter c
                JOIN chapter_texts ct ON c._id = ct.chapter
                WHERE c._id = ? AND ct.lang = ?
            `;
            const r = await this.db.execute({
                sql: query,
                args: [id, lang]
            });
            return r.rows[0];
        } catch (err) {
            throw err;
        }
    }

}