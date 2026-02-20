import * as Types from "@/types/unit.types"

export function parseBasic(data: string) {
    return JSON.parse(data);
}

export function groupAbilities(abilities: Types.AbilityJSON): Types.Ability {
    const groupedContent: Record<string, Types.AbilityContent[]> = {};

    for (const ability of abilities.content) {
        const key = String(ability.type.id);
        if (!groupedContent[key]) {
            groupedContent[key] = [];
        }
        groupedContent[key].push(ability);
    }

    return {
        count: abilities.count,
        content: groupedContent
    };
}