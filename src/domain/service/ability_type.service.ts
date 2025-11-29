import { AbilityTypeRepo } from "../repository/ability_type.repo";
import type { TSAbilityType } from "../../models/ability.type";

export class AbilityTypeService {
    private readonly abilityTypeRepo: AbilityTypeRepo;

    constructor(abilityTypeRepo: AbilityTypeRepo) {
        this.abilityTypeRepo = abilityTypeRepo;
    }

    async readAll(): Promise<TSAbilityType[]> {
        const data = await this.abilityTypeRepo.readAll();
        const rows = data.rows;

        const results: TSAbilityType[] = rows.map(row => ({
            id: Number(row["_id"]),
            content: String(row["content"])
        }));

        return results;
    }
}