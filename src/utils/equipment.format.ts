import { RawEquipment } from "../types/equip.raw";
import { Data } from "../types/data";

export function FormatEquip(equip: RawEquipment, rarity: Data[]) {
    const match = {
        Rarity: getMatchingID(equip.rarity, rarity),
    };

    return {
        _id: equip._id,
        name: equip.name,
        unique_for: equip.rarity == 5 && equip.traits.includes("DBL"),
        traits: extractTraits(JSON.parse(equip.traits)),
        rarity: match.Rarity,
        slot1: {
            amount: JSON.parse(equip.slot1).length,
            buffs: formatBuffs(equip.slot1),
            values: extractValues(equip.slot1)
        },
        slot2: {
            amount: JSON.parse(equip.slot2).length,
            buffs: formatBuffs(equip.slot2),
            values: extractValues(equip.slot2)
        },
        slot3: {
            amount: JSON.parse(equip.slot3).length,
            buffs: formatBuffs(equip.slot3),
            values: extractValues(equip.slot3)
        }
    };
}


function getMatchingID(match: number | [], from: Data[]) {
    if (Array.isArray(match)) {
        return [...new Set(
            match
                .filter(trait => from.some(item => item._id === trait))
                .map(trait => from.find(item => item._id === trait))
        )].map(item => ({
            _id: item._id,
            tag: item.es
        }));
    } else {
        const matchedItem = from.find(item => item._id === match);
        return matchedItem ? { _id: matchedItem._id, tag: matchedItem.es } : {};
    }
}

function formatBuffs(slot: string): Record<string, Record<string, string>> {
    const parsedSlot: string[][] = JSON.parse(slot);
    const formattedBuffs: Record<string, Record<string, string>> = {};

    parsedSlot.forEach((option, index) => {
        const optionKey = `option_${index + 1}`;
        formattedBuffs[optionKey] = {};

        option.forEach((buff, buffIndex) => {
            formattedBuffs[optionKey][`${buffIndex + 1}`] = buff;
        });
    });

    return formattedBuffs;
}

function extractValues(slot: string): Record<string, Record<string, { min: number, max: number }>> {
    const parsedSlot: string[][] = JSON.parse(slot);
    const extractedValues: Record<string, Record<string, { min: number, max: number }>> = {};

    parsedSlot.forEach((option, index) => {
        const optionKey = `option_${index + 1}`;
        extractedValues[optionKey] = {};

        option.forEach((buff, buffIndex) => {
            const match = buff.match(/([-+]?[0-9]*\.?[0-9]+)\s*~\s*([-+]?[0-9]*\.?[0-9]+)/);
            if (match) {
                extractedValues[optionKey][`${buffIndex + 1}`] = {
                    min: parseFloat(match[1]),
                    max: parseFloat(match[2])
                };
            }
        });
    });

    return extractedValues;
}

function extractTraits(traits: string[][][]): Record<string, string[]> {
    const extractedTraits: Record<string, string[]> = {};

    traits.forEach((option, index) => {
        const optionKey = `option_${index + 1}`;

        // Si hay más de un elemento en el array, los agregamos como un array en la opción
        if (option.length > 1) {
            extractedTraits[optionKey] = option.flat();
        } else {
            // Si solo hay un elemento, lo agregamos de forma individual
            extractedTraits[optionKey] = option[0];
        }
    });

    return extractedTraits;
}