import { Supabase } from "../database/supabase";

export async function getEquipsRarity() {
    const { data, error } = await Supabase
        .from("equips_rarity")
        .select("_id, es")

    if (error) throw new Error(error.message);

    return data;
}