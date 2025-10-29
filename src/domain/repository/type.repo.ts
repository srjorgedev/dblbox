import type { Client, ResultSet } from "@libsql/client";
import type IRepository from "./repo.interface.ts";

type Type = {
    id: number;
};

export class TypeRepo implements IRepository<Type> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    getAll(): Promise<ResultSet> {
        const query: string = `SELECT _id FROM type`;
        return this.conn.execute(query);
    }
    
    create(type: Type): Promise<ResultSet> {
        const query: string = `INSERT INTO type (_id) VALUES (?)`;
        return this.conn.execute(query, [type.id]);
    }
}