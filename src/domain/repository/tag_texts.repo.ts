import type IRepository from "./repo.interface.ts";
import type { Client, ResultSet } from "@libsql/client";

type TagText = {
    id: number;
    tag: number;
    lang: string;
    content: string;
};

export class TagTextsRepo implements IRepository<TagText> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    getAll(): Promise<ResultSet> {
        const query: string = `SELECT id, tag, lang, content FROM tag_texts`;
        return this.conn.execute(query);
    }

    create(tagText: TagText): Promise<ResultSet> {
        const query: string = `INSERT INTO tag_texts (tag, lang, content) VALUES (?, ?, ?)`;
        return this.conn.execute(query, [tagText.tag, tagText.lang, tagText.content]);
    }
}