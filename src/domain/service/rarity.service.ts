import { RarityRepo } from "../repository/rarity.repo";

export class RarityService {
    private readonly rarityRepo: RarityRepo;

    constructor(rarityRepo: RarityRepo) {
        this.rarityRepo = rarityRepo;
    }

    async findAllRarities(lang: string) {
        try {
            return await this.rarityRepo.findAll(lang);
        } catch (error) {
            throw error;
        }
    }

    async findRarityByID(id: number, lang: string) {
        try {
            return await this.rarityRepo.findByID(id, lang);
        } catch (error) {
            throw error;
        }
    }
}
