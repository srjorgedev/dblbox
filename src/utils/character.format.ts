import { RawCharacter, RawSummary } from "../types/character.raw.js";
import { Data, DataArray } from "../types/data.js";
import { FormatedCharacter } from "../types/formated.character";
import { FormatedCharacterV2, Name } from "../types/formated.character.v2.js";

export function summaryFormat(character: RawSummary, data: DataArray) {
    const { tag, type, chapter, color, rarity } = data

    const match = {
        Tag: getMatchingID(JSON.parse(character.tags), tag),
        Chapter: getMatchingID(parseInt((character.chapter).replace(/[^\d]/g, '')), chapter),
        Color: getMatchingID(JSON.parse(character.color), color),
        Rarity: getMatchingID(parseInt((character.rarity).replace(/[^\d]/g, '')), rarity),
        Type: getMatchingID(parseInt((character.type).replace(/[^\d]/g, '')), type),
    }

    const name = getName(character.name)

    return {
        _id: character._id,
        num: character.num_id,
        name: name,
        color: match.Color,
        type: match.Type,
        chapter: match.Chapter,
        rarity: match.Rarity,
        tags: match.Tag,
        lf: character.is_lf,
        transformable: character.transformable,
        switch: character.tag_switch,
        zenkai: character.has_zenkai,
        fusion: character.fusion,
        states:
            (character.fusion && character.transformable ? 3 :
                (character.fusion && character.revival ? 3 :
                    (character.fusion && character.tag_switch ? 3 :
                        (character.tag_switch ? 2 :
                            (character.transformable ? 2 :
                                (character.revival ? 2 : 1))))))
    }
}

export function basicFormat(character: RawCharacter, data: DataArray) {
    const { tag, type, chapter, color, rarity } = data
    const { abilities, zenkai_abilities, arts, zenkai_arts } = character;

    const match = {
        Tag: getMatchingID(JSON.parse(character.tags), tag),
        Chapter: getMatchingID(parseInt((character.chapter).replace(/[^\d]/g, '')), chapter),
        Color: getMatchingID(JSON.parse(character.color), color),
        Rarity: getMatchingID(parseInt((character.rarity).replace(/[^\d]/g, '')), rarity),
        Type: getMatchingID(parseInt((character.type).replace(/[^\d]/g, '')), type),
    }

    const Format = {
        _id: character._id,
        num: character.num_id,
        name: character.name,
        color: match.Color,
        type: match.Type,
        chapter: match.Chapter,
        rarity: match.Rarity,
        tags: match.Tag,
        lf: character.is_lf,
        transformable: character.transformable,
        switch: character.tag_switch,
        zenkai: character.has_zenkai,
        fusion: character.fusion,
        abilities: {
            zAbility: JSON.parse(abilities.z),
            main: JSON.parse(abilities.main),
            ultra: abilities.ultra ? JSON.parse(abilities.ultra) : null,
            unique1: abilities.ability_1 ? JSON.parse(abilities.ability_1) : null,
            unique2: abilities.ability_2 ? JSON.parse(abilities.ability_2) : null,
            limitedZ: abilities.z_limited ? JSON.parse(abilities.z_limited) : null,
        },
        zenkaiAbilities: character.has_zenkai && {
            main: JSON.parse(zenkai_abilities.main),
            unique1: zenkai_abilities.ability_1 ? JSON.parse(zenkai_abilities.ability_1) : null,
            unique2: zenkai_abilities.ability_2 ? JSON.parse(zenkai_abilities.ability_2) : null,
            unique3: zenkai_abilities.ability_3 ? JSON.parse(zenkai_abilities.ability_3) : null,
            unique4: zenkai_abilities.ability_4 ? JSON.parse(zenkai_abilities.ability_4) : null,
            zenkaiAbility: JSON.parse(zenkai_abilities.zenkai_ability),
        } || null,
        arts: {
            strike: JSON.parse(arts.strike),
            blast: JSON.parse(arts.blast),
            specialMove: JSON.parse(arts.special_move),
            specialArt: JSON.parse(arts.special_art),
            ultimate: JSON.parse(arts.ultimate),
            awaken: arts.awaken ? JSON.parse(arts.awaken) : null,
        },
        zenkaiArts: character.has_zenkai && {
            strike: JSON.parse(zenkai_arts.strike),
            blast: JSON.parse(zenkai_arts.blast),
            specialMove: JSON.parse(zenkai_arts.special_move),
            specialArt: JSON.parse(zenkai_arts.special_art),
            ultimate: JSON.parse(zenkai_arts.ultimate),
            awaken: zenkai_arts.awaken ? JSON.parse(zenkai_arts.awaken) : null,
        } || null
    } satisfies FormatedCharacter

    return Format
}

function mapAbility(arr: string[][]): { title: string, desc: string }[] {
    return arr
        .map(item => (item ? { title: item[0], desc: item[1] } : null))
        .filter(Boolean);
}

function getName(name: string): string | Name {
    try {
        const parsed = JSON.parse(name);
        if (Array.isArray(parsed)) {
            const length = parsed.length;
            if (length === 4) {
                return {
                    name1: parsed[0],
                    name2: parsed[1],
                    name3: parsed[2],
                    title: parsed[3]
                };
            } else if (length === 3) {
                return {
                    name1: parsed[0],
                    name2: parsed[1],
                    title: parsed[2]
                };
            } else if (length === 2) {
                return {
                    name1: parsed[0],
                    name2: parsed[1],
                    title: parsed[0]
                };
            }
        }
        return name;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return name;
    }
}
export function basicFormatV2(character: RawCharacter, data: DataArray) {
    const { tag, type, chapter, color, rarity } = data
    const { abilities, zenkai_abilities, arts, zenkai_arts } = character;

    const match = {
        Tag: getMatchingID(JSON.parse(character.tags), tag),
        Chapter: getMatchingID(parseInt((character.chapter).replace(/[^\d]/g, '')), chapter),
        Color: getMatchingID(JSON.parse(character.color), color),
        Rarity: getMatchingID(parseInt((character.rarity).replace(/[^\d]/g, '')), rarity),
        Type: getMatchingID(parseInt((character.type).replace(/[^\d]/g, '')), type),
    }

    const name = getName(character.name)

    const unique1: string[][] = abilities.ability_1 ? JSON.parse(abilities.ability_1) : null;
    const unique2: string[][] = abilities.ability_2 ? JSON.parse(abilities.ability_2) : null;
    const main: string[][] = JSON.parse(abilities.main);

    const z_unique1: string[][] = zenkai_abilities.ability_1 ? JSON.parse(zenkai_abilities.ability_1) : null;
    const z_unique2: string[][] = zenkai_abilities.ability_2 ? JSON.parse(zenkai_abilities.ability_2) : null;
    const z_unique3: string[][] = zenkai_abilities.ability_3 ? JSON.parse(zenkai_abilities.ability_3) : null;
    const z_unique4: string[][] = zenkai_abilities.ability_4 ? JSON.parse(zenkai_abilities.ability_4) : null;
    const z_main: string[][] = JSON.parse(zenkai_abilities.main);

    const specialArt: string[][] = JSON.parse(arts.special_art);
    const specialMove: string[][] = JSON.parse(arts.special_move);
    const ultimate: string[][] = arts.ultimate ? JSON.parse(arts.ultimate) : null;
    const awaken: string[][] = arts.awaken ? JSON.parse(arts.awaken) : null;
    const strike: string[][] = JSON.parse(arts.strike);
    const blast: string[][] = JSON.parse(arts.blast);

    const z_specialArt: string[][] = JSON.parse(zenkai_arts.special_art);
    const z_specialMove: string[][] = JSON.parse(zenkai_arts.special_move);
    const z_ultimate: string[][] = zenkai_arts.ultimate ? JSON.parse(zenkai_arts.ultimate) : null;
    const z_awaken: string[][] = zenkai_arts.awaken ? JSON.parse(zenkai_arts.awaken) : null;
    const z_strike: string[][] = JSON.parse(zenkai_arts.strike);
    const z_blast: string[][] = JSON.parse(zenkai_arts.blast);

    const ultra: string[][] = abilities.ultra ? JSON.parse(abilities.ultra) : null;

    const Format = {
        basic: {
            _id: character._id,
            num: character.num_id,
            name: name,
            color: match.Color,
            type: match.Type,
            chapter: match.Chapter,
            rarity: match.Rarity,
            tags: match.Tag,
            lf: character.is_lf,
            transformable: character.transformable,
            switch: character.tag_switch,
            zenkai: character.has_zenkai,
            fusion: character.fusion,
            states: main.length,
            zenkaiStates: character.has_zenkai ? z_main.length : null
        },
        abilities: {
            zAbility: JSON.parse(abilities.z),
            main: mapAbility(main),
            ultra: abilities.ultra ? mapAbility(ultra) : null,
            unique1: mapAbility(unique1),
            unique2: mapAbility(unique2),
            limitedZ: abilities.z_limited ? JSON.parse(abilities.z_limited) : null,
        },
        arts: {
            strike: mapAbility(strike),
            blast: mapAbility(blast),
            specialMove: mapAbility(specialMove),
            specialArt: mapAbility(specialArt),
            ultimate: arts.ultimate ? mapAbility(ultimate) : null,
            awaken: arts.awaken ? mapAbility(awaken) : null,
        },
        zenkaiAbilities: character.has_zenkai && {
            main: mapAbility(z_main),
            unique1: mapAbility(z_unique1),
            unique2: mapAbility(z_unique2),
            unique3: mapAbility(z_unique3),
            unique4: mapAbility(z_unique4),
            zenkaiAbility: JSON.parse(zenkai_abilities.zenkai_ability),
        } || null,
        zenkaiArts: character.has_zenkai && {
            strike: mapAbility(z_strike),
            blast: mapAbility(z_blast),
            specialMove: mapAbility(z_specialMove),
            specialArt: mapAbility(z_specialArt),
            ultimate: zenkai_arts.ultimate ? mapAbility(z_ultimate) : null,
            awaken: zenkai_arts.awaken ? mapAbility(z_awaken) : null,
        } || null
    } as FormatedCharacterV2

    return Format
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