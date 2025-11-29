import { QUnits } from "../../db/queries/unit.queries";
import type { TRUnit } from "../../models/unit.type";
import { log } from "../../utils/log";
import type IRepository from "./repo.interface"
import type { Client, ResultSet } from "@libsql/client"

export class UnitRepo implements IRepository<TRUnit> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    async readAll(): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadAll;
            return await this.conn.execute(query);
        } catch (error) {
            log("[UNIT REPO]: ReadAll Error -> " + error)
            throw error;
        }
    }

    async readAllWithPages(limit: number, offset: number): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadAllWithPages;
            return await this.conn.execute(query, [limit, offset]);
        } catch (error) {
            log("[UNIT REPO]: ReadAllWithPages Error -> " + error)
            throw error;
        }
    }

    async readAllSummariesWithPages(limit: number, offset: number): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadAllSummaryWithPages;
            return await this.conn.execute(query, [limit, offset]);
        } catch (error) {
            log("[UNIT REPO]: ReadAllSummariesWithPages Error -> " + error)
            throw error;
        }
    }

    async readByID(id: string): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadByID;
            return await this.conn.execute(query, [id]);
        } catch (error) {
            log("[UNIT REPO]: ReadByID Error -> " + error)
            throw error;
        }
    }

    async readByNUM(num: number): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadByNUM;
            return await this.conn.execute(query, [num]);
        } catch (error) {
            log("[UNIT REPO]: ReadByNUM Error -> " + error)
            throw error;
        }
    }

    async readCount(): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadTotal;
            return await this.conn.execute(query);
        } catch (error) {
            log("[UNIT REPO]: ReadCount Error -> " + error)
            throw error;
        }
    }

    async create(unit: TRUnit): Promise<ResultSet> {
        try {
            const query: string = `INSERT INTO unit (_id, _num, type, chapter, rarity, lf, transform, tagswitch, zenkai) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            return this.conn.execute(query, [unit.id, unit.num, unit.type, unit.chapter, unit.rarity, unit.lf, unit.transform, unit.tagswitch, unit.zenkai]);
        } catch (error) {
            log("[UNIT REPO]: Create Error -> " + error)
            throw error;
        }
    }
}