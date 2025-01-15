import { Supabase } from "../database/supabase";
import { RawCharacter, RawSummary } from "../types/character.raw";

export async function all(): Promise<RawCharacter[]> {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('*, abilities(*), arts(*), zenkai_abilities(*), zenkai_arts(*)');

    if (error) throw new Error(error.message);

    return data as RawCharacter[];
}

export async function byNumID(id: number): Promise<RawCharacter> {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('*, abilities(*), arts(*), zenkai_abilities(*), zenkai_arts(*)')
        .eq('num_id', id);

    if (error) throw new Error(error.message);
    if (typeof data[0] === 'undefined') throw new Error(`Character with num_id ${id} not found`);

    return data[0] as RawCharacter;
}

export async function byID(id: string): Promise<RawCharacter> {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('*, abilities(*), arts(*), zenkai_abilities(*), zenkai_arts(*)')
        .eq('_id', id);

    if (error) throw new Error(error.message);
    if (typeof data[0] === 'undefined') throw new Error(`Character with num_id ${id} not found`);

    return data[0] as RawCharacter;
}

export async function summaryAll(): Promise<RawSummary[]> {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('_id, num_id, name, color, type, chapter, tags, rarity, is_lf, transformable, tag_switch, revival, has_zenkai, fusion')
        .order('rarity', { ascending: false })
        .order('num_id', { ascending: false });

    if (error) throw new Error(error.message);

    return data
}

export async function summaryByNumID(id: number) {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('_id, num_id, name, color, type, chapter, tags, rarity, is_lf, transformable, tag_switch, revival, has_zenkai')
        .eq("num_id", id)

    if (error) throw new Error(error.message);

    return data[0]
}

export const getCharacter = {
    all,
    byNumID,
    byID,
    summaryAll,
    summaryByNumID
}