import type { Client, ResultSet } from "@libsql/client"
import type IRepository from "./repo.interface.ts";

type Lang = {
    code: string,
    name: string
}

export class LangRepo implements IRepository<Lang> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    readAll(): Promise<ResultSet> {
        return this.conn.execute("SELECT _code as Code, name as Name FROM lang")
    }

    create(lang: Lang): Promise<ResultSet> {
        const query: string = `INSERT INTO lang (_code, name) VALUES (?, ?)`;
        return this.conn.execute(query, [lang.code, lang.name])
    }
}