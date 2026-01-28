import { Client } from "@libsql/client";
import { UnitQueries } from "../../db/queries/unit.query";

type Unit = {
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

type Out = {
    unit_id: string
    unit_num: number
    transform: number
    lf: number
    zenkai: number
    tagswitch: number
    unit_names: string
    rarity_texts: string
    type_texts: string
    chapter_texts: string
    color_texts: string
    tag_texts: string;
}

export class UnitRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findByName(name: string): Promise<Out[]> {
        try {
            const r = await this.db.execute({
                sql: UnitQueries.findByName,
                args: [name]
            });
            return r.rows as unknown as Out[];
        } catch (err) {
            throw err;
        }
    }

    async findByID(id: string, lang: string): Promise<Out> {
        try {
            const r = await this.db.execute({
                sql: UnitQueries.findByID,
                args: [lang, lang, lang, lang, lang, lang, id]
            });
            return r.rows[0] as unknown as Out;
        } catch (err) {
            throw err;
        }
    }

    async findByNum(num: number, lang: string): Promise<Out> {
        try {
            const r = await this.db.execute({
                sql: UnitQueries.findByNum,
                args: [lang, lang, lang, lang, lang, lang, num]
            });
            return r.rows[0] as unknown as Out;
        } catch (err) {
            console.log("REPO -> " + err)
            throw err;
        }
    }

    async findAll(lang: string): Promise<Out[]> { // -> Find all returns the summary version of all units
        try {
            const r = await this.db.execute({
                sql: UnitQueries.findAll,
                args: [lang, lang, lang, lang, lang, lang]
            });
            return r.rows as unknown as Out[];
        } catch (err) {
            throw err;
        }
    }

    async findPages(lang: string, limit: number, offset: number): Promise<Out[]> {
        try {
            const r = await this.db.execute({
                sql: UnitQueries.findPages,
                args: [lang, lang, lang, lang, lang, lang, limit, offset]
            });
            return r.rows as unknown as Out[];
        } catch (err) {
            throw err;
        }
    }

    async countTotal(): Promise<Number> {
        try {
            const r = await this.db.execute({
                sql: UnitQueries.count
            });
            return r.rows[0].Total as unknown as Number;
        } catch (err) {
            throw err
        }
    }

    async create() {

    }
}


