import { Supabase } from "../database/supabase";
import { RawCharacter } from "../types/character.raw";

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

export const getCharacter = {
    all,
    byNumID,
    byID
}