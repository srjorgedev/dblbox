import type { Client, ResultSet } from "@libsql/client";
import type IRepository from "./repo.interface";

type Type = {
    id: number;
};

export class TypeRepo implements IRepository<Type> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    readAll(): Promise<ResultSet> {
        const query: string = `
        SELECT 
            type._id as type_id,
            type_texts.content as type_name,
            lang._code as lang_code
        FROM type
        JOIN type_texts ON type._id = type_texts.type
        JOIN lang ON type_texts.lang = lang._code
		ORDER BY type._id
        `;
        return this.conn.execute(query);
    }

    create(type: Type): Promise<ResultSet> {
        const query: string = `INSERT INTO type (_id) VALUES (?)`;
        return this.conn.execute(query, [type.id]);
    }
}