import { Client } from "@libsql/client";
import * as Types from "@/types/equip.types"
import { EquipQueries, SortQueries } from "@/v1/queries/equip.query";

export class EquipRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findAll(lang: string, sort: Types.Sort): Promise<Types.DBArrResponse<"equipment_json">> {
        const r = await this.db.execute({
            sql: EquipQueries.findAll.replace("<order>", SortQueries[sort]),
            args: [lang, lang, lang, lang, lang, lang]
        })

        return r.rows as unknown as Types.DBArrResponse<"equipment_json">;
    }

    async findPage(limit: number, offset: number, lang: string, sort: Types.Sort): Promise<Types.DBArrResponse<"equipment_json">> {
        const r = await this.db.execute({
            sql: EquipQueries.findPages.replace("<order>", SortQueries[sort]),
            args: [lang, lang, limit, offset]
        })

        return r.rows as unknown as Types.DBArrResponse<"equipment_json">;
    }

    async findByID(id: number, lang: string): Promise<Types.DBAllResponse> {
        const r = await this.db.execute({
            sql: EquipQueries.findByID,
            args: [lang, lang, lang, lang, lang, lang, lang, lang, id]
        })

        return r.rows[0] as unknown as Types.DBAllResponse;
    }

    async count(): Promise<number> {
        const r = await this.db.execute({
            sql: EquipQueries.count
        });

        return Number(r.rows[0].Total);
    }
}