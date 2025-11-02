import type IRepository from "./repo.interface.ts";
import type { Client, ResultSet } from "@libsql/client";
import type { TRTagText } from "../../models/tag.type.ts";


export class TagTextsRepo implements IRepository<TRTagText> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    readAll(): Promise<ResultSet> {
        const query: string = `SELECT id, tag, lang, content FROM tag_texts`;
        return this.conn.execute(query);
    }

    create(tagText: TRTagText): Promise<ResultSet> {
        const query: string = `INSERT INTO tag_texts (tag, lang, content) VALUES (?, ?, ?)`;
        return this.conn.execute(query, [tagText.tag, tagText.lang, tagText.content]);
    }
}