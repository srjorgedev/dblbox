import { UnitRepo } from "../repository/unit.repo";
import type {
    Unit, DataArray, DataSimple, DataObject
} from "../../types/unit.types";

export class UnitService {
    private readonly unitRepo: UnitRepo;

    constructor(unitRepo: UnitRepo) {
        this.unitRepo = unitRepo;
    }

    async readAllUnitsPages(lang: string, limit: number, page: number): Promise<Unit[]> {
        try {
            const offset = (page - 1) * limit;
            const units = await this.unitRepo.findPages(lang, limit, offset);

            return units
                .map(unit => this.parseUnitData(unit))
                .filter((unit): unit is Unit => unit !== null);

        } catch (error) {
            throw error;
        }
    }

    async readAllUnits(lang: string): Promise<Unit[]> {
        try {
            const units = await this.unitRepo.findAll(lang);

            return units
                .map(unit => this.parseUnitData(unit))
                .filter((unit): unit is Unit => unit !== null);
        } catch (error) {
            throw error;
        }
    }

    async readUnitByNum(num: number, lang: string) {
        try {
            const unit = await this.unitRepo.findByNum(num, lang);
            return this.parseUnitData(unit);
        } catch (error) {
            console.log("SERVICE -> " + error);
            throw error;
        }
    }

    async readUnitByID(id: string, lang: string) {
        try {
            const unit = await this.unitRepo.findByID(id, lang);
            return this.parseUnitData(unit);
        } catch (error) {
            console.log("SERVICE -> " + error);
            throw error;
        }
    }

    private parseUnitData(unit: any): Unit | null {
        if (!unit) return null;

        return {
            _id: unit.unit_id,
            num: unit.unit_num,
            transform: Boolean(unit.transform),
            lf: Boolean(unit.lf),
            zenkai: Boolean(unit.zenkai),
            tagswitch: Boolean(unit.tagswitch),
            name: this.formatSimpleList(unit.unit_names),
            rarity: this.splitDoubleColon(unit.rarity_texts),
            chapter: this.splitDoubleColon(unit.chapter_texts),
            type: this.splitDoubleColon(unit.type_texts),
            color: this.formatComplexList(unit.color_texts),
            tags: this.formatComplexList(unit.tag_texts)
        };
    }

    private splitDoubleColon(text: string): DataSimple {
        const parts = (text || "").split("::");
        return {
            id: Number(parts[0]) || 0,
            name: parts[parts.length - 1] || "Unknown"
        };
    }

    private formatSimpleList(text: string): DataArray {
        const items = (text || "").split(',').filter(Boolean);
        const content = items.map(item => {
            const parts = item.split('::');
            return parts[parts.length - 1];
        });
        return { count: content.length, content };
    }

    private formatComplexList(text: string): DataObject {
        const items = (text || "").split(',').filter(Boolean);
        const content = items.map(item => this.splitDoubleColon(item));
        return { count: content.length, content };
    }

}