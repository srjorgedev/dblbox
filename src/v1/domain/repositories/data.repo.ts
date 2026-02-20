import type * as Types from "@/types/data.types";
import { Client } from "@libsql/client";

export class DataRepo {
    private readonly db: Client;
    private readonly table: Types.Table;

    constructor(db: Client, table: Types.Table) {
        this.db = db;
        this.table = table;
    }

    async findAll(lang: string) {
        const query = `
SELECT 
	JSON_OBJECT(
		'id', d._id,
		'name', texts.content
	) data
FROM ${this.table} d
LEFT JOIN ${this.table}_texts texts ON d._id = texts.${this.table}
WHERE texts.lang = ?
        `
        const r = await this.db.execute({
            sql: query,
            args: [lang]
        })

        return r.rows as unknown as Record<"data", string>[];
    }

    async findByID(id: number, lang: string) {
        const query = `
SELECT 
    JSON_OBJECT(
        'id', d._id,
        'name', texts.content
    ) data
FROM ${this.table} d
JOIN ${this.table}_texts texts ON d._id = texts.${this.table}
WHERE d._id = ? AND texts.lang = ?
        `;
        const r = await this.db.execute({
            sql: query,
            args: [id, lang]
        });

        return r.rows[0] as unknown as Record<"data", string>;
    }

    async create(id: number) {
        const query: string = `INSERT INTO ${this.table}(_id) VALUES (?)`

        const r = await this.db.execute({
            sql: query,
            args: [id]
        })

        return r.rowsAffected
    }

    async exist(id: number) {
        const query: string = `SELECT COUNT(_id) as Total FROM ${this.table};`

        const r = await this.db.execute({
            sql: query,
            args: [id]
        })

        return r.rows[0].Total
    }

    async createTexts(id: number, lang: string, text: string) {
        const query: string = `INSERT INTO ${this.table}_texts(${this.table}, lang, content) VALUES (?, ?, ?)`

        const r = await this.db.execute({
            sql: query,
            args: [id, lang, text]
        })

        return r.rowsAffected
    }
}