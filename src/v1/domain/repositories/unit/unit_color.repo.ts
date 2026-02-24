import { Client } from "@libsql/client";
import { UnitQueries } from "@/v1/queries/unit.query";
import type * as Types from "@/types/unit.types";
import { insertQueryBuilder, updateQueryBuilder } from "@/utils/unit.util";

export class UnitColorRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findByID(unit_id: string, lang: string): Promise<Types.UnitColor[]> {
        const r = await this.db.execute({
            sql: UnitQueries.findColorByID,
            args: [lang, unit_id]
        });

        return r.rows as unknown as Types.UnitColor[];
    }

    async insertSingle(data: Types.UnitColor): Promise<number> {
        const r = await this.db.execute({
            sql: insertQueryBuilder("unit_color"),
            args: [data.number, data.unit, data.color]
        });

        return r.rowsAffected;
    }

    async insertMultiple(data: Types.UnitColor[]): Promise<Types.MultipleInsert> {
        const statements = data.map((item) => ({
            sql: insertQueryBuilder("unit_color"),
            args: [
                item.number,
                item.unit,
                item.color,
            ],
        }));

        const r = await this.db.batch(statements, "write");

        return {
            inserted: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }

    async updateSingle(prev: Types.ColorActionRequiered, next: Types.UnitColorUpdate): Promise<number> {
        const query = updateQueryBuilder("unit_color", next, "color");
        const r = await this.db.execute({
            sql: query.sql,
            args: [...query.values, prev.number, prev.unit]
        });

        return r.rowsAffected;
    }

    async updateMultiple(prev: Types.ColorActionRequiered[], next: Types.UnitColorUpdate[]) {
        const statements = next.map((item, i) => {
            const generated = updateQueryBuilder("unit_color", item, "color");

            return {
                sql: generated.sql,
                args: [...generated.values, prev[i].number, prev[i].unit]
            }
        });

        if (statements.length == 0) throw new Error("Coudn't update data", { cause: "No statements" });

        const r = await this.db.batch(statements, "write")

        return {
            updateStatements: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }

    async deleteSingle(data: Types.ColorActionRequiered): Promise<number> {
        const r = await this.db.execute({
            sql: UnitQueries.deleteColor,
            args: [data.number, data.unit]
        })

        return r.rowsAffected;
    }

    async deleteMultiple(data: Types.ColorActionRequiered[]) {
        const statements = data.map((item) => ({
            sql: UnitQueries.deleteColor,
            args: [item.number, item.unit]
        }));

        const r = await this.db.batch(statements, "write");

        return {
            deleted: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }
}