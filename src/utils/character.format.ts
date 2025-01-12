import { RawCharacter, RawSummary } from "../types/character.raw.js";
import { Data, DataArray } from "../types/data.js";
import { FormatedCharacter } from "../types/formated.character";

export function summaryFormat(character: RawSummary, data: DataArray) {
    const { tag, type, chapter, color, rarity } = data

    const match = {
        Tag: getMatchingID(JSON.parse(character.tags), tag),
        Chapter: getMatchingID(parseInt((character.chapter).replace(/[^\d]/g, '')), chapter),
        Color: getMatchingID(JSON.parse(character.color), color),
        Rarity: getMatchingID(parseInt((character.rarity).replace(/[^\d]/g, '')), rarity),
        Type: getMatchingID(parseInt((character.type).replace(/[^\d]/g, '')), type),
    }

    return {
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