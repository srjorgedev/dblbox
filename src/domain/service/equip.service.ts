import { EquipRepo } from "@/domain/repository/equip.repo";
import { AppError } from "@/utils/AppError";

export class EquipService {
    private readonly equipRepo: EquipRepo;

    constructor(equipRepo: EquipRepo) {
        this.equipRepo = equipRepo;
    }

    async findAllEquips(lang: string) {
        return await this.equipRepo.findAll(lang);
    }

    async findEquipByID(id: number, lang: string) {
        const equip = await this.equipRepo.findByID(id, lang);
        if (!equip) throw new AppError(`Equipment with ID ${id} not found`, 404);
        return equip;
    }

    async findAllByUnitID(id: string, lang: string) {
        const equips = await this.equipRepo.findAllByUnitID(id, lang)
        if (!equips) throw new AppError("Error getting equips", 404)
        return equips
    }

    async findUnitByEquipID(id: number, lang: string) {
        const units = await this.equipRepo.findUnitsByEquipID(id, lang)
        if (!units) throw new AppError("Error getting equips", 404)
        return units
    }
}
