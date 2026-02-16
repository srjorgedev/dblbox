import { UnitRepo } from "@/domain/repository/unit.repo";
import type {
    PaginatedResponse,
    Unit,
    UnitPOST, UnitUpdate
} from "@/types/unit.types";
import { AppError } from "@/utils/AppError";
import {
    parseUnitData
} from "@/utils/unit.parser";

export class UnitService {
    private readonly unitRepo: UnitRepo;

    constructor(unitRepo: UnitRepo) {
        this.unitRepo = unitRepo;
    }

    async createUnit(data: UnitPOST): Promise<Unit> {
        await this.unitRepo.create(data);
        return await this.readUnitByID(data.id, "en");
    }

    async updateUnit(id: string, data: UnitUpdate, lang: string = "en"): Promise<Unit> {
        const unit = await this.unitRepo.findByID(id, lang);
        if (!unit) throw new AppError(`Unit with ID ${id} not found`, 404);

        await this.unitRepo.update(id, data);
        return await this.readUnitByID(id, lang);
    }

    async findUnitsByName(name: string, lang: string): Promise<Unit[]> {
        const units = await this.unitRepo.findByName(name, lang);
        return units
            .map(unit => parseUnitData(unit))
            .filter((unit): unit is Unit => unit !== null);
    }

    async readAllUnitsPages(lang: string, limit: number, page: number, order: string): Promise<PaginatedResponse<Unit>> {
        const offset = (page - 1) * limit;
        const total = Number(await this.unitRepo.countTotal());
        const units = await this.unitRepo.findPages(lang, limit, offset, order);

        const data = units
            .map(unit => parseUnitData(unit))
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
            .map(unit => parseUnitData(unit))
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
        return parseUnitData(unit);
    }

    async readUnitByID(id: string, lang: string) {
        const unit = await this.unitRepo.findByID(id, lang);
        if (!unit) throw new AppError(`Unit with ID ${id} not found`, 404);
        return parseUnitData(unit) as Unit;
    }
}