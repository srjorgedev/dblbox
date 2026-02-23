import { SuggestionRepo, EquipRepo, UnitRepo } from "@/v1/domain/repositories";
import type * as Types from "@/types/suggestion.types";

export class SuggestionService {
    private readonly repo: SuggestionRepo;
    private readonly rEquip: EquipRepo;
    private readonly rUnit: UnitRepo;

    constructor(repo: SuggestionRepo, equipRepo: EquipRepo, unitRepo: UnitRepo) {
        this.repo = repo;
        this.rEquip = equipRepo;
        this.rUnit = unitRepo;
    }

    async insertByUnit(data: Types.Insert) {
        const r = await this.repo.insertByUnit(data);

        if (r == 0 || r < 0) return this.zero(r);

        return {
            meta: {},
            data: {
                message: `Ally added.`,
                success: true
            }
        }
    }

    async insertByEquip(data: Types.Insert) {
        const r = await this.repo.insertByEquip(data);

        if (r == 0 || r < 0) return this.zero(r);

        return {
            meta: {},
            data: {
                message: `Equipment added.`,
                success: true
            }
        }
    }

    async findByUnit(unit: string, lang: string) {
        const r = await this.repo.findByUnit(unit);

        const units = await Promise.all(
            r.map(async (data) => {
                const unit_data = await this.rUnit.findByID(data.ally_id, lang);

                return {
                    unit: data.unit_id,
                    amount: data.amount,
                    ally: JSON.parse(unit_data.basic_json)
                };
            })
        );

        return {
            meta: {
                lang,
                count: units.length
            },
            data: units
        }
    }

    async findByEquip(unit_id: string, lang: string) {
        const r = await this.repo.findByEquip(unit_id);

        const equips = await Promise.all(
            r.map(async (data) => {
                const equip_data = await this.rEquip.findByID(Number(data.equipment_id), lang);

                return {
                    equip_id: data.equipment_id,
                    amount: data.amount,
                    equip: JSON.parse(equip_data.equipment_json)
                }
            })
        )

        return {
            meta: {
                lang,
                count: equips.length
            },
            data: equips
        }
    }

    async deleteByUnit(user_id: string, unit_id: string, ally_id: string) {
        const r = await this.repo.deleteByUnit(user_id, unit_id, ally_id);

        if (r == 0 || r < 0) return this.zero(r);

        return {
            meta: {},
            data: {
                message: `Unit deleted.`,
                success: true
            }
        }
    }

    async deleteByEquip(user_id: string, unit_id: string, equip_id: number) {
        const r = await this.repo.deleteByEquip(user_id, unit_id, equip_id);

        if (r == 0 || r < 0) return this.zero(r);

        return {
            meta: {},
            data: {
                message: `Equip deleted.`,
                success: true
            }
        }
    }

    zero(r: number) {
        if (r == 0 || r < 0) {
            return {
                meta: {},
                data: {
                    message: `No changes.`,
                    success: true
                }
            }
        }
    }
}