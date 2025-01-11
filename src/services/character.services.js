import { Supabase } from "../database/supabase.js";

export async function all() {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('*, abilities(*), arts(*), zenkai_abilities(*), zenkai_arts(*)');

    return data;
}

export async function byNumID(id) {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('*, abilities(*), arts(*), zenkai_abilities(*), zenkai_arts(*)')
        .eq('num_id', id);

    if (typeof data[0] === 'undefined') throw new Error(`Character with num_id ${id} not found`);

    return data;
}

export async function byID(id) {
    const { data, error } = await Supabase
        .from('character_basic')
        .select('*, abilities(*), arts(*), zenkai_abilities(*), zenkai_arts(*)')
        .eq('_id', id);

    return data;
}

export const getCharacter = {
    all,
    byNumID,
    byID
}