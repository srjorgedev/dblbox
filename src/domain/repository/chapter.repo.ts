import type IRepository from "./repo.interface";
import type { ILonely } from "./repo.interface";
import type { Client, ResultSet } from "@libsql/client";

type Chapter = {
    id: number;
}

export class ChapterRepo implements IRepository<Chapter>, ILonely {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    readAll(): Promise<ResultSet> {
        const query: string = `
        SELECT 
            chapter._id as chapter_id,
            chapter_texts.content as chapter_name,
            lang._code as lang_code
        FROM chapter
        JOIN chapter_texts ON chapter._id = chapter_texts.chapter
        JOIN lang ON chapter_texts.lang = lang._code
		ORDER BY chapter._id
        `;
        return this.conn.execute(query);
    }

    create(): Promise<ResultSet> {
        const query: string = `INSERT INTO chapter DEFAULT VALUES`;
        return this.conn.execute(query);
    }
}