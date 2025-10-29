import type IRepository from "./repo.interface.ts";
import type { Client, ResultSet } from "@libsql/client";

type Rarity = {
    id: number;
};

export class RarityRepo implements IRepository<Rarity> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    getAll(): Promise<ResultSet> {
        const query: string = `SELECT _id FROM rarity`;
        return this.conn.execute(query);
    }

    create(rarity: Rarity): Promise<ResultSet> {
        const query: string = `INSERT INTO rarity (_id) VALUES (?)`;
        return this.conn.execute(query, [rarity.id]);
    }
}