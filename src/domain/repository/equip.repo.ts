import { Client } from "@libsql/client";
import { EquipQueries } from "@/domain/repository/queries/equip.query";

type RawBasicEquip = {
    _id: number;
    type: string;
    is_awaken: number;
    is_top: number;
    _from: number | null;
}

type RawCompleteEquip = {
    _id: number;
    type: string;
    is_awaken: number;
    is_top: number;
    _from: number | null;
    conditions_list: string;
    effects_list: string;
}

export class EquipRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findAll(lang: string): Promise<RawBasicEquip[]> {
        const r = await this.db.execute({
            sql: EquipQueries.findAll,
            args: [lang]
        });
        return r.rows as unknown as RawBasicEquip[];
    }

    async findByID(id: number, lang: string): Promise<RawCompleteEquip> {
        const r = await this.db.execute({
            sql: EquipQueries.findByID,
            args: [lang, lang, lang, lang, lang, lang, lang, id]
        });

        return r.rows[0] as unknown as RawCompleteEquip;
    }

    async findAllByUnitID(id: string, lang: string) {
        const r = await this.db.execute({
            sql: EquipQueries.findAllByUnitID,
            args: [id, lang]
        })

        return r.rows as unknown as RawBasicEquip[];
    }

    async findUnitsByEquipID(id: number, lang: string) {
        const r = await this.db.execute({
            sql: EquipQueries.findUnitsByEquipID,
            args: [lang, lang, lang, lang, lang, lang, id]
        })

        return r.rows
    }
}