import { Client } from "@libsql/client";
import { UnitQueries } from "@/v1/queries/unit.query";
import type * as Types from "@/types/unit.types";
import { insertQueryBuilder, updateQueryBuilder } from "@/utils/unit.util";

export class UnitTagRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findByID(unit_id: string, lang: string): Promise<Types.UnitTag[]> {
        const r = await this.db.execute({
            sql: UnitQueries.findTagByID,
            args: [lang, unit_id]
        });

        return r.rows as unknown as Types.UnitTag[];
    }

    async insertSingle(data: Types.UnitTag): Promise<number> {
        const r = await this.db.execute({
            sql: insertQueryBuilder("unit_tag"),
            args: [data.unit, data.tag]
        });

        return r.rowsAffected;
    }

    async insertMultiple(data: Types.UnitTag[]): Promise<Types.MultipleInsert> {
        const statements = data.map((item) => ({
            sql: insertQueryBuilder("unit_tag"),
            args: [
                item.unit,
                item.tag,
            ],
        }));

        const r = await this.db.batch(statements, "write");

        return {
            inserted: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }

    async deleteSingle(data: Types.TagActionRequiered): Promise<number> {
        const r = await this.db.execute({
            sql: UnitQueries.deleteTag,
            args: [data.unit, data.tag]
        })

        return r.rowsAffected;
    }

    async deleteMultiple(data: Types.TagActionRequiered[]) {
        const statements = data.map((item) => ({
            sql: UnitQueries.deleteTag,
            args: [item.unit, item.tag]
        }));

        const r = await this.db.batch(statements, "write");

        return {
            deleted: r.length,
            totalRowsAffected: r.reduce((a, r) => a + r.rowsAffected, 0)
        }
    }
}