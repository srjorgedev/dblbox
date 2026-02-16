import type {
    AbilitiesObject, Ability,
    DataArray,
    DataObject,
    DataSimple,
    Unit,
    UnitRaw
} from "@/types/unit.types";

export function parseUnitData(unit: UnitRaw): Unit | null {
    if (!unit) return null;

    const states = unit.transform + unit.tagswitch + unit.fusion + 1;

    return {
        _id: unit.unit_id,
        num: unit.unit_num,
        transform: Boolean(unit.transform),
        lf: Boolean(unit.lf),
        zenkai: Boolean(unit.zenkai),
        tagswitch: Boolean(unit.tagswitch),
        fusion: Boolean(unit.fusion),
        states: states,
        name: formatSimpleList(unit.unit_names),
        rarity: splitDoubleColon(unit.rarity_texts),
        chapter: splitDoubleColon(unit.chapter_texts),
        type: splitDoubleColon(unit.type_texts),
        color: formatComplexList(unit.color_texts),
        tags: formatComplexList(unit.tag_texts),
        abilities: unit.ability_texts ? formatAbilityList(unit.ability_texts, false) : undefined,
        zenkai_abilities: unit.ability_texts ? formatAbilityList(unit.ability_texts, true) : undefined
    };
}

    export function splitDoubleColon(text: string): DataSimple {
    const parts = (text || "").split("::");
    return {
        id: Number(parts[0]) || 0,
        name: parts[parts.length - 1] || "Unknown"
    };
}

    export function formatSimpleList(text: string): DataArray {
    const items = (text || "").split('|||').filter(Boolean);
    const content = items.map(item => {
        const parts = item.split('::');
        return parts[parts.length - 1];
    });
    return { count: content.length, content };
}

    export function formatComplexList(text: string): DataObject {
    const items = (text || "").split('|||').filter(Boolean);
    const content = items.map(item => splitDoubleColon(item));
    return { count: content.length, content };
}

    export function formatAbilityList(text: string, isZenkai: boolean): AbilitiesObject {
    const items = (text || "").split('|||').filter(Boolean);
    const allAbilities: Ability[] = items.map(item => {
        const parts = item.split('::');
        return {
            number: Number(parts[0]) || 0,
            zenkai: parts[1] === "1",
            title: parts[2] || "Unknown",
            content: parts[3] || "Unknown",
            type: {
                id: Number(parts[4]) || 0,
                name: parts[5] || "Unknown"
            }
        };
    });

    const abilities = allAbilities.filter(a => a.zenkai === isZenkai);

    if (abilities.length === 0) {
        return { count: 0, content: {} };
    }

    abilities.sort((a, b) => a.number - b.number);

    const groups: Record<string, Ability[]> = {};
    for (const ability of abilities) {
        const typeName = ability.type.name;
        if (!groups[typeName]) {
            groups[typeName] = [];
        }
        groups[typeName].push(ability);
    }

    const sortedGroups = Object.entries(groups).sort(([, aAbilities], [, bAbilities]) => {
        const aTypeId = aAbilities[0]?.type.id || 0;
        const bTypeId = bAbilities[0]?.type.id || 0;
        return aTypeId - bTypeId;
    });

    const content: Record<string, Ability | Ability[]> = {};
    for (const [key, value] of sortedGroups) {
        content[key] = value.length === 1 ? value[0] : value;
    }

    return { count: abilities.length, content };
}