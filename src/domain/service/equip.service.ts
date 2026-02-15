import { EquipRepo } from "@/domain/repository/equip.repo";
import { AppError } from "@/utils/AppError";

type RawBasicEquip = {
    _id: number;
    type: string;
    is_awaken: number;
    is_top: number;
    _from: number | null;
}

type RawCompleteEquip = {
    _id: number;
    type: string;
    is_awaken: number;
    is_top: number;
    _from: number | null;
    conditions_list: string;
    effects_list: string;
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
        return this.complexParseEquip(equip);
    }

    async findAllByUnitID(id: string, lang: string) {
        const equips = await this.equipRepo.findAllByUnitID(id, lang)
        if (!equips) throw new AppError("Error getting equips", 404)
        return equips.map(equip => this.basicParseEquip(equip))
    }

    async findUnitByEquipID(id: number, lang: string) {
        const units = await this.equipRepo.findUnitsByEquipID(id, lang)
        if (!units) throw new AppError("Error getting equips", 404)
        return units
    }

    complexParseEquip(equip: RawCompleteEquip) {
        const [tId, tLang, tContent] = equip.type?.split("::") ?? [];
        const type = tId ? { id: Number(tId), lang: tLang, content: tContent } : "";

        const rawConditions = (equip.conditions_list || "").split(" | ").filter(Boolean);

        const parsedConditionsContent = rawConditions.map(raw => {
            const [idStr, contentStr] = raw.split("::::");
            if (!contentStr) return null;

            const requirements = contentStr.split(",").map(req => {
                const parts = req.split("::");
                const cType = parts[0];

                if (cType === 'unit') {
                    return { type: cType, code: parts[1], id: Number(parts[2]) };
                }
                if (cType === 'tag' || cType === 'episode') {
                    return { type: cType, id: Number(parts[1]), name: parts[2], lang: parts[3] };
                }

                return { type: cType, params: parts.slice(1) };
            });

            return {
                condition_num: Number(idStr),
                requirements
            };
        }).filter(Boolean);

        const conditions = {
            count: parsedConditionsContent.length,
            content: parsedConditionsContent
        };

        const slotsMap: Record<number, { type: number; texts: Record<number, string> }> = {};

        (equip.effects_list || "").split(" | ").forEach(raw => {
            const [sId, sType, eId, text] = raw.split("::::");
            const slotNum = Number(sId);
            const effectNum = Number(eId);

            if (Number.isNaN(slotNum) || Number.isNaN(effectNum)) return;
            if (!text) return;

            const slot = (slotsMap[slotNum] ||= { type: Number(sType), texts: {} });
            slot.texts[effectNum] = slot.texts[effectNum] ? `${slot.texts[effectNum]}\n${text}` : text;
        });

        const effects = Object.entries(slotsMap)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([sId, data]) => {
                const textEntries = Object.entries(data.texts);

                const values = textEntries.map(([eIdStr, text]) => {
                    const id = Number(eIdStr);
                    if (data.type === 1) {
                        const match = text.match(/(\d+(?:\.\d+)?)\s*~\s*(\d+(?:\.\d+)?)/);
                        return {
                            effectNum: id,
                            range: match ? { min: Number(match[1]), max: Number(match[2]) } : null
                        };
                    }
                    if (data.type === 2) {
                        return { effectNum: id, option: text };
                    }
                    return { effectNum: id };
                });

                return {
                    slotNum: Number(sId),
                    slotType: data.type,
                    effectCount: textEntries.length,
                    effects: Object.values(data.texts),
                    values
                };
            });

        return {
            id: Number(equip._id),
            type,
            conditions,
            effects,
            isAwaken: !!equip.is_awaken,
            isTop: !!equip.is_top,
            from: equip._from != null ? Number(equip._from) : null,
        };
    }

    basicParseEquip(equip: RawBasicEquip) {
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
