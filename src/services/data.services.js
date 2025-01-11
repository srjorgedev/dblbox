import { Supabase } from "../database/supabase.js";

export async function getTag() {
    const { data, error } = await Supabase
        .from('data_tag')
        .select('_id, es')

    return data;
}

export async function getType() {
    const { data, error } = await Supabase
        .from('data_type')
        .select('_id, es')

    return data;
}

export async function getColor() {
    const { data, error } = await Supabase
        .from('data_color')
        .select('_id, es')

    return data;
}


export async function getChapter() {
    const { data, error } = await Supabase
        .from('data_chapter')
        .select('_id, es')

    return data;
}

export async function getRarity() {
    const { data, error } = await Supabase
        .from('data_rarity')
        .select('_id, es')

    return data;
}