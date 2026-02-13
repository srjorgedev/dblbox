import { Client } from "@libsql/client";
import { EquipQueries } from "@/domain/repository/queries/equip.query";

export class EquipRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findAll(lang: string) {
        const r = await this.db.execute({
            sql: EquipQueries.findAll,
            args: [lang]
        });
        return r.rows;
    }

    async findByID(id: number, lang: string) {
        const r = await this.db.execute({
            sql: EquipQueries.findByID,
            args: [lang, lang, lang, lang, lang, lang, id]
        });

        return r.rows[0];
    }

    async findAllByUnitID(id: string) {
        const r = await this.db.execute({
            sql: EquipQueries.findAllByUnitID,
            args: [id]
        })

        return r.rows
    }

    async findUnitsByEquipID(id: number, lang: string) {
        const r = await this.db.execute({
            sql: EquipQueries.findUnitsByEquipID,
            args: [lang, lang, lang, lang, lang, lang, id]
        })

        return r.rows
    }
}