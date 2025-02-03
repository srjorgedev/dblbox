import { Supabase } from "../database/supabase";
import { RawCharacter, RawSummary } from "../types/character.raw";

async function all(): Promise<RawCharacter[]> {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('*, abilities(*), arts(*), zenkai_abilities(*), zenkai_arts(*)');

    if (error) throw new Error(error.message);

    return data as RawCharacter[];
}

async function byNumID(id: number): Promise<RawCharacter> {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('*, abilities(*), arts(*), zenkai_abilities(*), zenkai_arts(*)')
        .eq('num_id', id);

    if (error) throw new Error(error.message);
    if (typeof data[0] === 'undefined') throw new Error(`Character with num_id ${id} not found`);

    return data[0] as RawCharacter;
}

async function byID(id: string): Promise<RawCharacter> {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('*, abilities(*), arts(*), zenkai_abilities(*), zenkai_arts(*)')
        .eq('_id', id);

    if (error) throw new Error(error.message);
    if (typeof data[0] === 'undefined') throw new Error(`Character with num_id ${id} not found`);

    return data[0] as RawCharacter;
}

async function summaryAll(): Promise<RawSummary[]> {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('_id, num_id, name, color, type, chapter, tags, rarity, is_lf, transformable, tag_switch, revival, has_zenkai, fusion')
        .order('rarity', { ascending: false })
        .order('is_lf', { ascending: false })
        .order('num_id', { ascending: false });

    if (error) throw new Error(error.message);

    return data
}

async function summaryByNumID(id: number): Promise<RawSummary> {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('_id, num_id, name, color, type, chapter, tags, rarity, is_lf, transformable, tag_switch, revival, has_zenkai, fusion')
        .eq("num_id", id)

    if (error) throw new Error(error.message);

    return data[0]
}

async function summaryByRarity(rarity: number): Promise<RawSummary[]> {
    const { data, error } = await Supabase
        .from("character_basic")
        .select('_id, num_id, name, color, type, chapter, tags, rarity, is_lf, transformable, tag_switch, revival, has_zenkai, fusion')
        .like('type', `[${rarity}]`)

    if (error) throw new Error(error.message);

    return data
}

async function summaryByIsLL(): Promise<RawSummary[]> {
    const { data, error } = await Supabase
        .from("character_basic")
        .select('_id, num_id, name, color, type, chapter, tags, rarity, is_lf, transformable, tag_switch, revival, has_zenkai, fusion')
        .eq('is_lf', true)

    if (error) throw new Error(error.message);

    return data
}

export const getCharacter = {
    all,
    byNumID,
    byID,
    summaryAll,
    summaryByNumID,
    summaryByRarity,
    summaryByIsLL
}