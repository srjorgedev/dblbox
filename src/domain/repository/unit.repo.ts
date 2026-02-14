import type { Client, ResultSet } from "@libsql/client";
import { QUnits } from "../../db/queries/unit.queries";
import { log } from "../../utils/log";

type UnitReq = {
    id: string;
    num: number;
    type: number;
    chapter: number;
    rarity: number;
    lf: boolean;
    transform: boolean;
    tagswitch: boolean;
    zenkai: boolean;
}

export class UnitRepo {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    async findAll(): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadAll;
            return await this.conn.execute(query);
        } catch (error) {
            log("[UNIT REPO]: ReadAll Error -> " + error)
            throw error;
        }
    }

    async findAllWithPages(limit: number, offset: number): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadAllWithPages;
            return await this.conn.execute(query, [limit, offset]);
        } catch (error) {
            log("[UNIT REPO]: ReadAllWithPages Error -> " + error)
            throw error;
        }
    }

    async findSummariesWithPages(limit: number, offset: number): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadAllSummaryWithPages;
            return await this.conn.execute(query, [limit, offset]);
        } catch (error) {
            log("[UNIT REPO]: ReadAllSummariesWithPages Error -> " + error)
            throw error;
        }
    }

    async findByID(id: string): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadByID;
            return await this.conn.execute(query, [id]);
        } catch (error) {
            log("[UNIT REPO]: ReadByID Error -> " + error)
            throw error;
        }
    }

    async findByNum(num: number): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadByNUM;
            return await this.conn.execute(query, [num]);
        } catch (error) {
            log("[UNIT REPO]: ReadByNUM Error -> " + error)
            throw error;
        }
    }

    async findTotal(): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadTotal;
            return await this.conn.execute(query);
        } catch (error) {
            log("[UNIT REPO]: ReadCount Error -> " + error)
            throw error;
        }
    }

    async findByName(name: string): Promise<ResultSet> {
        try {
            const query: string = QUnits.ReadByName
            return await this.conn.execute(query, [name])
        } catch (error) {
            log("[UNIT REPO]: FindByName Error -> " + error)
            throw error
        }
    }

    async create(unit: UnitReq): Promise<ResultSet> {
        try {
            const query: string = `INSERT INTO unit (_id, _num, type, chapter, rarity, lf, transform, tagswitch, zenkai) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            return this.conn.execute(query, [unit.id, unit.num, unit.type, unit.chapter, unit.rarity, unit.lf, unit.transform, unit.tagswitch, unit.zenkai]);
        } catch (error) {
            log("[UNIT REPO]: Create Error -> " + error)
            throw error;
        }
    }

    async addTags(_id: string, tags: number) {
        try {
            const query: string = `INSERT INTO unit_tag (unit, tag) VALUES(?, ?)`;
            const r = await this.conn.execute(query, [_id, tags]);
            return r.rowsAffected
        } catch (error) {
            log("[UNIT REPO]: Create Error -> " + error)
            throw error;
        }
    }
}