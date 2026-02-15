import { EquipRepo } from "@/domain/repository/equip.repo";
import { AppError } from "@/utils/AppError";

type RawEquip = {
    _id: number;
    type: string;
    is_awaken: number;
    is_top: number;
    _from: number | null;
}

export class EquipService {
    private readonly equipRepo: EquipRepo;

    constructor(equipRepo: EquipRepo) {
        this.equipRepo = equipRepo;
    }

    async findAllEquips(lang: string) {
        const data = await this.equipRepo.findAll(lang);
        return data.map(equip => this.basicParseEquip(equip))
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

    complexParseEquip () {
        
    }

    basicParseEquip(equip: RawEquip) {
        let type;

        if (equip.type.length > 0) {
            const type_arr = equip.type.split("::")

            type = {
                id: Number(type_arr[0]),
                lang: type_arr[1],
                content: type_arr[2]
            }
        } else type = ""

        return {
            id: Number(equip._id),
            type: type,
            isAwaken: Boolean(equip.is_awaken),
            isTop: Boolean(equip.is_top),
            from: Number(equip._from)
        }
    }
}
