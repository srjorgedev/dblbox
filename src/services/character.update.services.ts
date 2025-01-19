import { Supabase } from "../database/supabase";
import { UpdateCharacter } from "../types/update.character";

async function updateCharacter(character: UpdateCharacter, id: number) {
    const { abilities, arts, zenkai_abilities, zenkai_arts, basic } = character

    const basicUpdate = basic ? Supabase.from("character_basic").upsert(basic).eq('num_id', id) : Promise.resolve();
    const abilitiesUpdate = abilities ? Supabase.from("character_abilities").upsert(abilities).eq('_id', id) : Promise.resolve();
    const artsUpdate = arts ? Supabase.from("character_arts").upsert(arts).eq('_id', id) : Promise.resolve();
    const artsZenkaiUpdate = zenkai_arts ? Supabase.from("character_zenkai_arts").upsert(zenkai_arts).eq('_id', id) : Promise.resolve();
    const abilitiesZenkaiUpdate = zenkai_abilities ? Supabase.from("character_zenkai_abilities").upsert(zenkai_abilities).eq('_id', id) : Promise.resolve();

    await Promise.all([basicUpdate, abilitiesUpdate, artsUpdate, artsZenkaiUpdate, abilitiesZenkaiUpdate]);

}

export const updateService = {
    updateCharacter
}