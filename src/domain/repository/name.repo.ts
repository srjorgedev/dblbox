import type { TRUnitName } from "../../models/unit.type";
import type IRepository from "./repo.interface"
import type { Client, ResultSet } from "@libsql/client"

export class UnitNameRepo implements IRepository<TRUnitName> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    readAll(): Promise<ResultSet> {
        const query: string = `SELECT * FROM unit_name`;
        return this.conn.execute(query);
    }

    create(unit: TRUnitName): Promise<ResultSet> {
        const query: string = `INSERT INTO unit_name (num, unit, lang, content) VALUES (?, ?, ?, ?)`;
        return this.conn.execute(query, [unit.num, unit.unit, unit.lang, unit.content]);
    }
}