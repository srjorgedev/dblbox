import type { Client, ResultSet } from "@libsql/client";
import type IRepository from "./repo.interface.ts";

type AbilityType = {
    id: number,
    content: string
}

export class AbilityTypeRepo implements IRepository<AbilityType> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    getAll(): Promise<ResultSet> {
        const query: string = `SELECT * FROM ability_type`;
        return this.conn.execute(query);
    }

    create(abilityType: AbilityType): Promise<ResultSet> {
        const query: string = `INSERT INTO ability_type (content) VALUES (?)`;
        return this.conn.execute(query, [abilityType.content]);
    }
}