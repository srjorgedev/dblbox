import * as Types from "@/types/equip.types";
import { EquipRepo } from "../repositories/equip.repo";
import { parseBasic } from "@/utils/unit.utils";

export class EquipService {
    private readonly repo: EquipRepo;

    constructor(unitRepo: EquipRepo) {
        this.repo = unitRepo;
    }

    async findAll(lang: string, sort: Types.Sort) {
        const r = await this.repo.findAll(lang, sort);

        return {
            meta: {
                totalElements: r.length
            },
            data: r.map(unit => JSON.parse(unit.equipment_json))
        }
    }

    async findByUnit(unit: string, lang: string) {
        const r = await this.repo.findByUnit(unit, lang);

        return {
            meta: {
                totalElements: r.length
            },
            data: r.map(unit => JSON.parse(unit.equipment_json))
        }
    }

    async findUnits(id: number, lang: string) {
        const r = await this.repo.findUnits(id, lang);

        return {
            meta: {
                totalElements: r.length
            },
            data: r.map(unit => parseBasic(unit.basic_json as string))
        }
    }

    async findPage(limit: number, page: number, lang: string, sort: Types.Sort) {
        const offset = (page - 1) * limit;

        const [total, r] = await Promise.all([
            this.repo.count(),
            this.repo.findPage(limit, offset, lang, sort)
        ]);

        const data = r.map(unit => JSON.parse(unit.equipment_json))

        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            meta: {
                elementsOnPage: data.length,
                totalElements: total,
                page,
                limit,
                totalPages,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null,
                hasNextPage,
                hasPrevPage
            },
            data
        }
    }

    async findByID(id: number, lang: string) {
        const r = await this.repo.findByID(id, lang);

        return {
            meta: {

            },
            data: {
                basic: JSON.parse(r.equipment_json),
                conditions: JSON.parse(r.conditions_list),
                effects: JSON.parse(r.effects_list)
            }
        }
    }
}