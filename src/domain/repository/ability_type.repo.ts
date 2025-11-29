import type { Client, ResultSet } from "@libsql/client";
import type IRepository from "./repo.interface";
import type { TRAbilityType } from "../../models/ability.type";

export class AbilityTypeRepo implements IRepository<TRAbilityType> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    readAll(): Promise<ResultSet> {
        const query: string = `SELECT * FROM ability_type`;
        return this.conn.execute(query);
    }

    create(abilityType: TRAbilityType): Promise<ResultSet> {
        const query: string = `INSERT INTO ability_type (content) VALUES (?)`;
        return this.conn.execute(query, [abilityType.content]);
    }
}