import { DataRepo } from "@/v1/domain/repositories";
import type * as Types from "@/types/data.types"

export class DataService {
    private readonly repo: DataRepo;

    constructor(repo: DataRepo) {
        this.repo = repo;
    }

    async findAll(lang: string) {
        const r = await this.repo.findAll(lang);
        const data: Types.Data[] = r.map(r => JSON.parse(r.data));

        return {
            meta: {
                totalElements: data.length,
                lang: lang
            },
            data: data
        }
    }

    async findByID(id: number, lang: string) {
        const r = await this.repo.findByID(id, lang);

        return {
            meta: {
                lang: lang
            },
            data: JSON.parse(r.data)
        }
    }
}