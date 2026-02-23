import { Client } from "@libsql/client";
import type * as Types from "@/types/suggestion.types"

export class SuggestionRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async insertByUnit(data: Types.Insert): Promise<number> {
        const r = await this.db.execute({
            sql: "INSERT INTO suggestion (unit_id, user_id, ally_id) VALUES (?, ?, ?);",
            args: [data.unit_id, data.user_id, data.value]
        })

        return r.rowsAffected
    }

    async insertByEquip(data: Types.Insert): Promise<number> {
        const r = await this.db.execute({
            sql: "INSERT INTO suggestion (unit_id, user_id, equipment_id) VALUES (?, ?, ?);",
            args: [data.unit_id, data.user_id, Number(data.value)]
        })

        return r.rowsAffected
    }

    async findByUnit(unit_id: string): Promise<Types.DBResponseUnit[]> {
        const r = await this.db.execute({
            sql: `SELECT ally_id, COUNT(ally_id) as amount FROM suggestion WHERE unit_id = ? GROUP BY ally_id ORDER BY amount DESC;`,
            args: [unit_id]
        });

        return r.rows as unknown as Types.DBResponseUnit[]
    }

    async findByEquip(unit_id: string): Promise<Types.DBResponseEquip[]> {
        const r = await this.db.execute({
            sql: `SELECT equipment_id, COUNT(equipment_id) as amount FROM suggestion WHERE unit_id = ? GROUP BY equipment_id ORDER BY amount DESC;`,
            args: [unit_id]
        });

        return r.rows as unknown as Types.DBResponseEquip[]
    }

    async deleteByUnit(user_id: string, unit_id: string, ally_id: string): Promise<number> {
        const r = await this.db.execute({
            sql: `DELETE FROM suggestion WHERE unit_id = ? and user_id = ? and ally_id = ?;`,
            args: [unit_id, user_id, ally_id]
        });

        return r.rowsAffected;
    }

    async deleteByEquip(user_id: string, unit_id: string, equip_id: number): Promise<number> {
        const r = await this.db.execute({
            sql: `DELETE FROM suggestion WHERE unit_id = ? and user_id = ? and equipment_id = ?;`,
            args: [unit_id, user_id, equip_id]
        });

        return r.rowsAffected;
    }
}