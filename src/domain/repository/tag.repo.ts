// Include the tag and tag_texts related db

import { Client } from "@libsql/client";

type createResponse = {
    rowsAffected: number;
    lostRowID: number | bigint;
}

export class TagRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async readAll(lang: string) {
        try {
            const query = `
                SELECT 
                    t._id,
                    tt.content as tag
                FROM tag t
                LEFT JOIN tag_texts tt ON t._id = tt.tag
                WHERE tt.lang = ?
            `

            const r = await this.db.execute({
                sql: query,
                args: [lang]
            })

            return r.rows;
        } catch (error) {
            throw error;
        }
    }

    async createTag(id: number): Promise<createResponse> {
        try {
            const query: string = `INSERT INTO tag(_id) VALUES (?)`

            const r = await this.db.execute({
                sql: query,
                args: [id]
            })

            return {
                rowsAffected: r.rowsAffected,
                lostRowID: r.lastInsertRowid ?? -1
            }
        } catch (error) {
            throw error;
        }
    }

    async createTexts(tag: number, lang: string, text: string) {
        try {
            const query: string = `INSERT INTO tag_texts(tag, lang, content) VALUES (?, ?, ?)`

            const r = await this.db.execute({
                sql: query,
                args: [tag, lang, text]
            })

            return {
                rowsAffected: r.rowsAffected,
                lostRowID: r.lastInsertRowid ?? -1
            }
        } catch (error) {

        }
    }
}