import { Client } from "@libsql/client";
import { UnitQueries, SortQueries } from "@/v1/queries/unit.query";
import * as Types from "@/types/unit.types";

export class UnitRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findAll(lang: string, sort: Types.Sort): Promise<Types.DBArrResponse<"basic_json">> {
        const r = await this.db.execute({
            sql: UnitQueries.findAll.replace("<order>", SortQueries[sort]),
            args: [lang, lang, lang, lang, lang, lang]
        })

        return r.rows as unknown as Types.DBArrResponse<"basic_json">;
    }

    async findPages(limit: number, offset: number, lang: string, sort: Types.Sort): Promise<Types.DBArrResponse<"basic_json">> {
        const r = await this.db.execute({
            sql: UnitQueries.findPages.replace("<order>", SortQueries[sort]),
            args: [lang, lang, lang, lang, lang, lang, limit, offset]
        })

        return r.rows as unknown as Types.DBArrResponse<"basic_json">;
    }

    async findByID(id: string, lang: string): Promise<Types.DBAllResponse> {
        const r = await this.db.execute({
            sql: UnitQueries.findByID,
            args: [lang, lang, lang, lang, lang, lang, lang, lang, lang, lang, id]
        })

        return r.rows[0] as unknown as Types.DBAllResponse;
    }

    async findByNUM(num: number, lang: string): Promise<Types.DBAllResponse> {
        const r = await this.db.execute({
            sql: UnitQueries.findByNum,
            args: [lang, lang, lang, lang, lang, lang, lang, lang, lang, lang, num]
        })

        return r.rows[0] as unknown as Types.DBAllResponse;
    }

    async count(): Promise<number> {
        const r = await this.db.execute({
            sql: UnitQueries.count
        });

        return Number(r.rows[0].Total);
    }
}