import { EquipRepo } from "../repository/equip.repo";

export class EquipService {
    private readonly equipRepo: EquipRepo;

    constructor(equipRepo: EquipRepo) {
        this.equipRepo = equipRepo;
    }

    async findAllEquips(lang: string) {
        try {
            return await this.equipRepo.findAll(lang);
        } catch (error) {
            throw error;
        }
    }

    async findEquipByID(id: number, lang: string) {
        try {
            return await this.equipRepo.findByID(id, lang);
        } catch (error) {
            throw error;
        }
    }
}
