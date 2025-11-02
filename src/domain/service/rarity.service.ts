import { RarityRepo } from "../repository/rarity.repo.ts";
import type { TSRarity, TRRarity } from "../../models/rarity.type.ts";

export class RarityService {
    private readonly rarityRepo: RarityRepo;

    constructor(rarityRepo: RarityRepo) {
        this.rarityRepo = rarityRepo;
    }

    async readAll(): Promise<TSRarity[]> {
        const data = await this.rarityRepo.readAll();
        const rows = data.rows

        const raritiesMap: Map<number, TSRarity> = new Map();

        for (const row of rows) {
            const rarity_id = Number(row["rarity_id"]);
            const rarity_name = String(row["rarity_name"]);
            const lang_code = String(row["lang_code"]);

            if (!raritiesMap.has(rarity_id)) {
                raritiesMap.set(rarity_id, { id: rarity_id, texts: {} });
            }

            raritiesMap.get(rarity_id)!.texts[lang_code] = rarity_name;
        }

        return Array.from(raritiesMap.values());
    }

    async create(rarity: TRRarity): Promise<any> {
        return await this.rarityRepo.create(rarity);
    }
}
