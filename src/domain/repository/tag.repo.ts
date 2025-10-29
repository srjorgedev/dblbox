import type { Client, ResultSet } from "@libsql/client";
import type IRepository from "./repo.interface.ts";

type Tag = {
    id: number;
};

export class TagRepo implements IRepository<Tag> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    getAll(): Promise<ResultSet> {
        const query: string = `
        SELECT 
            tag._id as tag_id,
            tag_texts.content as tag_name,
            lang._code as lang_code,
            lang.name as lang_name
        FROM tag
        JOIN tag_texts ON tag._id = tag_texts.tag
        JOIN lang ON tag_texts.lang = lang._code
		ORDER BY tag._id
        `;
        return this.conn.execute(query);
    }

    create(tag: Tag): Promise<ResultSet> {
        const query: string = `INSERT INTO tag (_id) VALUES (?)`;
        return this.conn.execute(query, [tag.id]);
    }
}