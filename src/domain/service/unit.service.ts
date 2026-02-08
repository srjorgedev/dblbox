import { UnitRepo } from "@/domain/repository/unit.repo";
import type {
    Unit, DataArray, DataSimple, DataObject, UnitPOST, UnitUpdate, PaginatedResponse, UnitRaw
} from "@/types/unit.types";
import { AppError } from "@/utils/AppError";

export class UnitService {
    private readonly unitRepo: UnitRepo;

    constructor(unitRepo: UnitRepo) {
        this.unitRepo = unitRepo;
    }

    async createUnit(data: UnitPOST): Promise<Unit> {
        await this.unitRepo.create(data);
        return await this.readUnitByID(data.id, "en");
    }

    async updateUnit(id: string, data: UnitUpdate): Promise<Unit> {
        const unit = await this.unitRepo.findByID(id, "en");
        if (!unit) throw new AppError(`Unit with ID ${id} not found`, 404);

        await this.unitRepo.update(id, data);
        return await this.readUnitByID(id, "en");
    }

    async readAllUnitsPages(lang: string, limit: number, page: number, order: string): Promise<PaginatedResponse<Unit>> {
        const offset = (page - 1) * limit;
        const total = Number(await this.unitRepo.countTotal());
        const units = await this.unitRepo.findPages(lang, limit, offset, order);

        const data = units
            .map(unit => this.parseUnitData(unit))
            .filter((unit): unit is Unit => unit !== null);

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            meta: {
                total,
                page,
                limit,
                totalPages,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null,
                hasNextPage,
                hasPrevPage
            },
            data
        };
    }

    async readAllUnits(lang: string, order: string): Promise<PaginatedResponse<Unit>> {
        const total = Number(await this.unitRepo.countTotal());
        const units = await this.unitRepo.findAll(lang, order);

        const data = units
            .map(unit => this.parseUnitData(unit))
            .filter((unit): unit is Unit => unit !== null);

        return {
            meta: {
                total,
                hasNextPage: false,
                hasPrevPage: false
            },
            data
        };
    }

    async readUnitByNum(num: number, lang: string) {
        const unit = await this.unitRepo.findByNum(num, lang);
        if (!unit) throw new AppError(`Unit with number ${num} not found`, 404);
        return this.parseUnitData(unit);
    }

    async readUnitByID(id: string, lang: string) {
        const unit = await this.unitRepo.findByID(id, lang);
        if (!unit) throw new AppError(`Unit with ID ${id} not found`, 404);
        return this.parseUnitData(unit) as Unit;
    }

    private parseUnitData(unit: UnitRaw): Unit | null {
        if (!unit) return null;

        const states = unit.transform + unit.tagswitch + unit.fusion + 1;

        return {
            _id: unit.unit_id,
            num: unit.unit_num,
            transform: Boolean(unit.transform),
            lf: Boolean(unit.lf),
            zenkai: Boolean(unit.zenkai),
            tagswitch: Boolean(unit.tagswitch),
            fusion: Boolean(unit.fusion),
            states: states,
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