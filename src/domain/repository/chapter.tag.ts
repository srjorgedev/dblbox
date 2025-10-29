import type IRepository from "./repo.interface.ts";
import type { Client, ResultSet } from "@libsql/client";

type Chapter = {
    id: number;
}

export class ChapterRepo implements IRepository<Chapter> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    getAll(): Promise<ResultSet> {
        const query: string = `SELECT _id FROM chapter`;
        return this.conn.execute(query);
    }

    create(chapter: Chapter): Promise<ResultSet> {
        const query: string = `INSERT INTO chapter (_id) VALUES (?)`;
        return this.conn.execute(query, [chapter.id]);
    }
}