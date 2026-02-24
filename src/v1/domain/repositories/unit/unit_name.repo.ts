import { Client } from "@libsql/client";
import { UnitQueries } from "@/v1/queries/unit.query";
import type * as Types from "@/types/unit.types";
import { updateQueryBuilder } from "@/utils/unit.util";

export class UnitNameRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findByID(unit_id: string): Promise<Types.UnitName> {
        const r = await this.db.execute({
            sql: UnitQueries.findNamesByID,
            args: [unit_id]
        });

        return r.rows as unknown as Types.UnitName;
    }

    async insertSingle(data: Types.UnitName): Promise<number> {
        const r = await this.db.execute({
            sql: UnitQueries.insertNames,
            args: [data.num, data.unit, data.lang, data.content, data.prefix ?? null]
        });

        return r.rowsAffected;
    }

    async insertMultiple(data: Types.UnitName[]): Promise<Types.MultipleInsert> {
        const statements = data.map((item) => ({
            sql: UnitQueries.insertNames,
            args: [
                item.num,
                item.unit,
                item.lang,
                item.content,
                item.prefix ?? null,
            ],
        }));

        const r = await this.db.batch(statements, "write");

        return {
            inserted: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }

    async updateSingle(prev: Types.NameActionRequiered, next: Types.UnitNameUpdate): Promise<number> {
        const query = updateQueryBuilder("unit_name", next, "name");
        const r = await this.db.execute({
            sql: query.sql,
            args: [...query.values, prev.num, prev.lang, prev.unit]
        });

        return r.rowsAffected;
    }

    async updateMultiple(prev: Types.NameActionRequiered[], next: Types.UnitNameUpdate[]) {
        const statements = next.map((item, i) => {
            const generated = updateQueryBuilder("unit_name", item, "name");

            return {
                sql: generated.sql,
                args: [...generated.values, prev[i].num, prev[i].lang, prev[i].unit]
            }
        });

        if (statements.length == 0) throw new Error("Coudn't update data", { cause: "No statements" });

        const r = await this.db.batch(statements, "write")

        return {
            updateStatements: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }

    async deleteSingle(data: Types.NameActionRequiered): Promise<number> {
        const r = await this.db.execute({
            sql: UnitQueries.deleteName,
            args: [data.num, data.lang, data.unit]
        })

        return r.rowsAffected;
    }

    async deleteMultiple(data: Types.NameActionRequiered[]) {
        const statements = data.map((item) => ({
            sql: UnitQueries.deleteName,
            args: [item.num, item.lang, item.unit],
        }));

        const r = await this.db.batch(statements, "write");

        return {
            deleted: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }
}