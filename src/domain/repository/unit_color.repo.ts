import type IRepository from "./repo.interface"
import type { Client, ResultSet } from "@libsql/client"

type TRUnitColor = {
    num: number;
    unit: string;
    color: number;
}

export class UnitColorRepo implements IRepository<TRUnitColor> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    readAll(): Promise<ResultSet> {
        const query: string = `SELECT * FROM unit_color`;
        return this.conn.execute(query);
    }

    create(unitColor: TRUnitColor): Promise<ResultSet> {
        const query: string = `INSERT INTO unit_color (number, unit, color) VALUES (?, ?, ?)`;
        return this.conn.execute(query, [unitColor.num, unitColor.unit, unitColor.color]);
    }

}