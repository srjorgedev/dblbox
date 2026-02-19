import * as Types from "@/types/unit.types";
import { UnitRepo } from "@/v1/domain/repositories/unit.repo";
import { parseBasic } from "@/utils/unit.utils";

export class UnitService {
    private readonly repo: UnitRepo;

    constructor(unitRepo: UnitRepo) {
        this.repo = unitRepo;
    }

    async findAll(lang: string, sort: Types.Sort) {
        const r = await this.repo.findAll(lang, sort);

        return {
            meta: {
                totalElements: r.length
            },
            data: r.map(unit => parseBasic(unit.basic_json))
        }
    }

    async findPage(limit: number, page: number, lang: string, sort: Types.Sort) {
        const offset = (page - 1) * limit;

        const [total, r] = await Promise.all([
            this.repo.count(),
            this.repo.findPages(limit, offset, lang, sort)
        ]);

        const data = r.map(unit => parseBasic(unit.basic_json))

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

    async findByID(id: string, lang: string) {
        const r = await this.repo.findByID(id, lang);

        return {
            meta: {

            },
            data: {
                basic: JSON.parse(r.basic_json),
                abilities: JSON.parse(r.abilities_json),
                zenkaiAbilities: JSON.parse(r.zenkai_abilities_json)
            }
        }
    }

    async findByNUM(num: number, lang: string) {
        const r = await this.repo.findByNUM(num, lang);

        return {
            meta: {

            },
            data: {
                basic: JSON.parse(r.basic_json),
                abilities: JSON.parse(r.abilities_json),
                zenkaiAbilities: JSON.parse(r.zenkai_abilities_json)
            }
        }
    }
}