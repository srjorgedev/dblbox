import { RarityRepo } from "../repository/rarity.repo";
import { AppError } from "../../utils/AppError";

export class RarityService {
    private readonly rarityRepo: RarityRepo;

    constructor(rarityRepo: RarityRepo) {
        this.rarityRepo = rarityRepo;
    }

    async findAllRarities(lang: string) {
        return await this.rarityRepo.findAll(lang);
    }

    async findRarityByID(id: number, lang: string) {
        const rarity = await this.rarityRepo.findByID(id, lang);
        if (!rarity) throw new AppError(`Rarity with ID ${id} not found`, 404);
        return rarity;
    }
}
