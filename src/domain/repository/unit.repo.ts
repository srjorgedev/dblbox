import { QUnits } from "../../db/queries/unit.queries";
import type { TRUnit } from "../../models/unit.type";
import type IRepository from "./repo.interface"
import type { Client, ResultSet } from "@libsql/client"

export class UnitRepo implements IRepository<TRUnit> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    async readAll(): Promise<ResultSet> {
        const query: string = QUnits.ReadAll;
        return await this.conn.execute(query);
    }

    async readAllWithPages(limit: number, offset: number): Promise<ResultSet> {
        const query: string = QUnits.ReadAllWithPages;
        return await this.conn.execute(query, [limit, offset]);
    }

    async readByID(id: string): Promise<ResultSet> {
        const query: string = QUnits.ReadByID;
        return await this.conn.execute(query, [id]);
    }

    async readByNUM(num: number): Promise<ResultSet> {
        const query: string = QUnits.ReadByNUM;
        return await this.conn.execute(query, [num]);
    }

    async create(unit: TRUnit): Promise<ResultSet> {
        const query: string = `INSERT INTO unit (_id, _num, type, chapter, rarity, lf, transform, tagswitch, zenkai) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        return this.conn.execute(query, [unit.id, unit.num, unit.type, unit.chapter, unit.rarity, unit.lf, unit.transform, unit.tagswitch, unit.zenkai]);
    }
}