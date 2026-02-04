import { Client } from "@libsql/client";
import { UnitQueries } from "../../db/queries/unit.query";
import type { UnitPOST, UnitUpdate } from "../../types/unit.types";
import { AppError } from "../../utils/AppError";

type Unit = {
    id: string;
    num: number;
    type: number;
    chapter: number;
    rarity: number;
    lf: boolean;
    transform: boolean;
    tagswitch: boolean;
    fusion: boolean;
    zenkai: boolean;
}

type Out = {
    unit_id: string
    unit_num: number
    transform: number
    lf: number
    zenkai: number
    tagswitch: number
    fusion: number
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
        const r = await this.db.execute({
            sql: UnitQueries.findByName,
            args: [name]
        });
        return r.rows as unknown as Out[];
    }

    async findByID(id: string, lang: string): Promise<Out> {
        const r = await this.db.execute({
            sql: UnitQueries.findByID,
            args: [lang, lang, lang, lang, lang, lang, id]
        });
        return r.rows[0] as unknown as Out;
    }

    async findByNum(num: number, lang: string): Promise<Out> {
        const r = await this.db.execute({
            sql: UnitQueries.findByNum,
            args: [lang, lang, lang, lang, lang, lang, num]
        });
        return r.rows[0] as unknown as Out;
    }

    async findAll(lang: string): Promise<Out[]> { // -> Find all returns the summary version of all units
        const r = await this.db.execute({
            sql: UnitQueries.findAll,
            args: [lang, lang, lang, lang, lang, lang]
        });
        return r.rows as unknown as Out[];
    }

    async findPages(lang: string, limit: number, offset: number): Promise<Out[]> {
        const r = await this.db.execute({
            sql: UnitQueries.findPages,
            args: [lang, lang, lang, lang, lang, lang, limit, offset]
        });
        return r.rows as unknown as Out[];
    }

    async countTotal(): Promise<Number> {
        const r = await this.db.execute({
            sql: UnitQueries.count
        });
        return r.rows[0].Total as unknown as Number;
    }

    async create(unit: UnitPOST): Promise<void> {
        const statements: { sql: string; args: any[] }[] = [];

        statements.push({
            sql: `INSERT INTO unit (_id, _num, type, chapter, rarity, transform, lf, zenkai, tagswitch, fusion) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                unit.id,
                unit.num,
                unit.type,
                unit.chapter,
                unit.rarity,
                unit.transform,
                unit.lf,
                unit.zenkai,
                unit.tagswitch,
                unit.fusion
            ]
        });

        for (const name of unit.name) {
            statements.push({
                sql: `INSERT INTO unit_name (unit, num, lang, content) VALUES (?, ?, ?, ?)`,
                args: [unit.id, name.num, name.lang, name.names]
            });
        }

        unit.color.forEach((colorId, index) => {
            statements.push({
                sql: `INSERT INTO unit_color (unit, color, number) VALUES (?, ?, ?)`,
                args: [unit.id, colorId, index + 1]
            });
        });

        for (const tagId of unit.tags) {
            statements.push({
                sql: `INSERT INTO unit_tag (unit, tag) VALUES (?, ?)`,
                args: [unit.id, tagId]
            });
        }

        for (const ability of unit.abilities) {
            statements.push({
                sql: `INSERT INTO ability (unit, number, zenkai, lang, title, content, ability_type) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    unit.id,
                    ability.number,
                    ability.isZenkai,
                    ability.lang,
                    ability.title,
                    ability.content,
                    ability.abilityType
                ]
            });
        }

        await this.executeTransactionWithRetry(statements);
    }

    async update(id: string, data: UnitUpdate): Promise<void> {
        const statements: { sql: string; args: any[] }[] = [];

        const updates: string[] = [];
        const args: any[] = [];

        if (data.num !== undefined) { updates.push("_num = ?"); args.push(data.num); }
        if (data.type !== undefined) { updates.push("type = ?"); args.push(data.type); }
        if (data.chapter !== undefined) { updates.push("chapter = ?"); args.push(data.chapter); }
        if (data.rarity !== undefined) { updates.push("rarity = ?"); args.push(data.rarity); }
        if (data.transform !== undefined) { updates.push("transform = ?"); args.push(data.transform); }
        if (data.lf !== undefined) { updates.push("lf = ?"); args.push(data.lf); }
        if (data.zenkai !== undefined) { updates.push("zenkai = ?"); args.push(data.zenkai); }
        if (data.tagswitch !== undefined) { updates.push("tagswitch = ?"); args.push(data.tagswitch); }
        if (data.fusion !== undefined) { updates.push("fusion = ?"); args.push(data.fusion); }

        if (updates.length > 0) {
            args.push(id);
            statements.push({
                sql: `UPDATE unit SET ${updates.join(", ")} WHERE _id = ?`,
                args: args
            });
        }

        if (data.name !== undefined) {
            for (const name of data.name) {
                statements.push({
                    sql: `INSERT OR REPLACE INTO unit_name (unit, num, lang, content) VALUES (?, ?, ?, ?)`,
                    args: [id, name.num, name.lang, name.names]
                });
            }
        }

        if (data.color !== undefined) {
            data.color.forEach((colorId, index) => {
                statements.push({
                    sql: `INSERT OR REPLACE INTO unit_color (unit, color, number) VALUES (?, ?, ?)`,
                    args: [id, colorId, index + 1]
                });
            });
        }

        if (data.tags !== undefined) {
            for (const tagId of data.tags) {
                statements.push({
                    sql: `INSERT OR IGNORE INTO unit_tag (unit, tag) VALUES (?, ?)`,
                    args: [id, tagId]
                });
            }
        }

        if (data.abilities !== undefined) {
            for (const ability of data.abilities) {
                statements.push({
                    sql: `INSERT OR REPLACE INTO ability (unit, number, zenkai, lang, title, content, ability_type) 
                          VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        id,
                        ability.number,
                        ability.isZenkai,
                        ability.lang,
                        ability.title,
                        ability.content,
                        ability.abilityType
                    ]
                });
            }
        }

        if (statements.length > 0) {
            await this.executeTransactionWithRetry(statements);
        }
    }

    private async executeTransactionWithRetry(statements: { sql: string; args: any[] }[]): Promise<void> {
        const MAX_RETRIES = 3;
        const BASE_DELAY = 100; // ms

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                await this.db.batch(statements, "write");
                return;
            } catch (error: any) {
                const isBusy = error.code === 'SQLITE_BUSY' || error.code === 'SQLITE_LOCKED' || (error.message && error.message.includes('database is locked'));

                if (isBusy && attempt < MAX_RETRIES - 1) {
                    await new Promise(resolve => setTimeout(resolve, BASE_DELAY * Math.pow(2, attempt)));
                    continue;
                }

                if (error.code === 'SQLITE_CONSTRAINT' || error.code === 'SQLITE_CONSTRAINT_UNIQUE' || (error.message && error.message.includes('UNIQUE constraint failed'))) {
                    throw new AppError('Operation failed: Duplicate entry detected (ID or Unique field already exists).', 409);
                }

                throw error;
            }
        }
    }
}


