import { UnitRepo } from "../repository/unit.repo";
import { MapData } from "../../utils/map";
import type { TSUnit } from "../../models/unit.type";
import type { Row } from "@libsql/client";

type AllResult = {
    data: TSUnit[],
    totalCount: number
}

function MapUnit(row: Row) {
    const names = MapData(row["unit_names"]!.toString().split(",").map(name => {
        const [num, lang, content] = name.split("::");
        return { id: Number(num), lang, name: content }
    }))

    const rarity = MapData(row["rarity_texts"]!.toString().split(",").map(name => {
        const [num, lang, content] = name.split("::");
        return { id: Number(num), lang, name: content }
    }))

    const type = MapData(row["type_texts"]!.toString().split(",").map(name => {
        const [num, lang, content] = name.split("::");
        return { id: Number(num), lang, name: content }
    }))

    const chapter = MapData(row["chapter_texts"]!.toString().split(",").map(name => {
        const [num, lang, content] = name.split("::");
        return { id: Number(num), lang, name: content }
    }))

    const colors = MapData(row["color_texts"]!.toString().split(",").map(name => {
        const [id, num, lang, content] = name.split("::");
        return { id: Number(id), number: Number(num), lang, name: content }
    }))

    return {
        id: String(row["unit_id"]),
        num: Number(row["unit_num"]),
        transform: Boolean(row["transform"]),
        lf: Boolean(row["lf"]),
        zenkai: Boolean(row["zenkai"]),
        tagswitch: Boolean(row["tagswitch"]),
        unit_names: names,
        rarity: rarity[0],
        type: type[0],
        chapter: chapter[0],
        colors: colors
    }
}

export class UnitService {
    private readonly unitRepo: UnitRepo;

    constructor(unitRepo: UnitRepo) {
        this.unitRepo = unitRepo;
    }

    async findAll(): Promise<any> {
        try {
            const data = await this.unitRepo.readAll();
            const units = data.rows.map(row => MapUnit(row))
            return units;
        } catch (error) {
            throw error;
        }
    }

    async count(): Promise<number> {
        try {
            const data = await this.unitRepo.readCount();
            return Number(data.rows[0]["total"])
        } catch (error) {
            throw error;
        }
    }

    async findAllWithPages(page: number, limit: number): Promise<TSUnit[]> {
        try {
            const offset: number = (page - 1) * limit;
            const data = await this.unitRepo.readAllWithPages(limit, offset);

            const units: TSUnit[] = data.rows.map(row => MapUnit(row))

            return units
        } catch (error) {
            throw error;
        }
    }

    async findAllSummariesWithPages(page: number, limit: number): Promise<TSUnit[]> {
        try {
            const offset: number = (page - 1) * limit;
            const data = await this.unitRepo.readAllWithPages(limit, offset);

            const units: TSUnit[] = data.rows.map(row => MapUnit(row))

            return units
        } catch (error) {
            throw error;
        }
    }

    async findByID(id: string): Promise<TSUnit> {
        try {
            const data = await this.unitRepo.readByID(id);
            if (data.rows.length === 0) {
                throw new Error("Unit not found");
            }
            const rows = data.rows[0]

            const names = MapData(JSON.parse(rows["unit_names"]!.toString()));
            const rarity = MapData(JSON.parse(rows["rarity_texts"]!.toString()));
            const type = MapData(JSON.parse(rows["type_texts"]!.toString()));
            const chapter = MapData(JSON.parse(rows["chapter_texts"]!.toString()));
            const colors = MapData(JSON.parse(rows["color_texts"]!.toString()));

            return {
                id: String(rows["unit_id"]),
                num: Number(rows["unit_num"]),
                transform: Boolean(rows["transform"]),
                lf: Boolean(rows["lf"]),
                zenkai: Boolean(rows["zenkai"]),
                tagswitch: Boolean(rows["tagswitch"]),
                unit_names: names,
                rarity: rarity[0],
                type: type[0],
                chapter: chapter[0],
                colors: colors
            }
        } catch (error) {
            throw error;
        }
    }

    async findByNUM(num: number): Promise<TSUnit> {
        try {
            const data = await this.unitRepo.readByNUM(num);
            if (data.rows.length === 0) {
                throw new Error("Unit not found");
            }
            const rows = data.rows[0]

            const names = MapData(JSON.parse(rows["unit_names"]!.toString()));
            const rarity = MapData(JSON.parse(rows["rarity_texts"]!.toString()));
            const type = MapData(JSON.parse(rows["type_texts"]!.toString()));
            const chapter = MapData(JSON.parse(rows["chapter_texts"]!.toString()));
            const colors = MapData(JSON.parse(rows["color_texts"]!.toString()));

            return {
                id: String(rows["unit_id"]),
                num: Number(rows["unit_num"]),
                transform: Boolean(rows["transform"]),
                lf: Boolean(rows["lf"]),
                zenkai: Boolean(rows["zenkai"]),
                tagswitch: Boolean(rows["tagswitch"]),
                unit_names: names,
                rarity: rarity[0],
                type: type[0],
                chapter: chapter[0],
                colors: colors
            }
        } catch (error) {
            throw error;
        }
    }
}