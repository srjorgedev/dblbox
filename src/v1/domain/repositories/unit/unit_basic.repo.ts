import { Client } from "@libsql/client";
import { UnitQueries } from "@/v1/queries/unit.query";
import type * as Types from "@/types/unit.types";
import { updateQueryBuilder } from "@/utils/unit.util";

export class UnitBasicRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findByID(unit_id: string, lang: string): Promise<Types.UnitBasicResponse> {
        const r = await this.db.execute({
            sql: UnitQueries.findBasicByID,
            args: [lang, lang, lang, unit_id]
        });

        return r.rows[0] as unknown as Types.UnitBasicResponse;
    }

    async insertSingle(data: Types.UnitBasic): Promise<number> {
        const r = await this.db.execute({
            sql: UnitQueries.insertBasic,
            args: [data._id, data._num, data.type,
            data.chapter, data.rarity, data.lf, data.transform, data.zenkai, data.tagswitch, data.fusion],
        });

        return r.rowsAffected;
    }

    async insertMultiple(data: Types.UnitBasic[]): Promise<Types.MultipleInsert> {
        const statements = data.map((item) => ({
            sql: UnitQueries.insertBasic,
            args: [item._id, item._num, item.type,
            item.chapter, item.rarity, item.lf, item.transform, item.zenkai, item.tagswitch, item.fusion],
        }));

        const r = await this.db.batch(statements, "write");

        return {
            inserted: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }

    async updateSingle(prev: Types.BasicActionRequiered, next: Types.UnitBasicUpdate): Promise<number> {
        const query = updateQueryBuilder("unit", next, "basic");
        const r = await this.db.execute({
            sql: query.sql,
            args: [...query.values, prev.unit_id]
        });

        return r.rowsAffected;
    }

    async updateMultiple(prev: Types.BasicActionRequiered[], next: Types.UnitBasicUpdate[]) {
        const statements = next.map((item, i) => {
            const generated = updateQueryBuilder("unit", item, "basic");

            return {
                sql: generated.sql,
                args: [...generated.values, prev[i].unit_id]
            }
        });

        if (statements.length == 0) throw new Error("Coudn't update data", { cause: "No statements" });

        const r = await this.db.batch(statements, "write")

        return {
            updateStatements: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }

    async deleteSingle(data: Types.BasicActionRequiered): Promise<number> {
        const r = await this.db.execute({
            sql: UnitQueries.deleteBasic,
            args: [data.unit_id]
        })

        return r.rowsAffected;
    }

    async deleteMultiple(data: Types.BasicActionRequiered[]) {
        const statements = data.map((item) => ({
            sql: UnitQueries.deleteBasic,
            args: [item.unit_id],
        }));

        const r = await this.db.batch(statements, "write");

        return {
            deleted: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }
}