/* eslint-disable @typescript-eslint/no-explicit-any */
import { Supabase } from "../database/supabase";
import type { UpdateCharacter, ZenkaiAbilities, ZenkaiArts, BasicUpdateData } from "../types/update.character";
import type { Arts, Abilities } from "../types/update.character";
import { removeEmptyValues } from "../utils/removeEmptyValues";

async function all(character: UpdateCharacter, id: number): Promise<{ success: boolean; error?: any }> {
    if (!character || typeof character !== 'object') {
        console.error('Invalid character data');
        return { success: false, error: 'Invalid character data' };
    }

    const {
        abilities = {},
        arts = {},
        basic = {},
        zenkai_abilities = {},
        zenkai_arts = {}
    } = character;

    const newAbilities = removeEmptyValues(abilities);
    const newArts = removeEmptyValues(arts);
    const newZenkaiAbilities = removeEmptyValues(zenkai_abilities);
    const newZenkaiArts = removeEmptyValues(zenkai_arts);
    const newBasic = removeEmptyValues(basic);

    let updatedBasic = Promise.resolve({ success: true });
    let updatedAbilities = Promise.resolve({ success: true });
    let updatedArts = Promise.resolve({ success: true });
    let updatedZenkaiAbilities = Promise.resolve({ success: true });
    let updatedZenkaiArts = Promise.resolve({ success: true });

    if (Object.keys(newBasic).length !== 0) {
        updatedBasic = updateCharacter.basic(newBasic, id);
    }
    if (Object.keys(newAbilities).length !== 0) {
        updatedAbilities = updateCharacter.abilities(newAbilities, id);
    }
    if (Object.keys(newArts).length !== 0) {
        updatedArts = updateCharacter.arts(newArts, id);
    }
    if (Object.keys(newZenkaiAbilities).length !== 0) {
        updatedZenkaiAbilities = updateCharacter.zenkaiAbilities(newZenkaiAbilities, id);
    }
    if (Object.keys(newZenkaiArts).length !== 0) {
        updatedZenkaiArts = updateCharacter.zenkaiArts(newZenkaiArts, id);
    }

    try {
        const results = await Promise.all([
            updatedBasic,
            updatedAbilities,
            updatedArts,
            updatedZenkaiAbilities,
            updatedZenkaiArts
        ]);

        const allSuccess = results.every(result => result.success);
    
        if (allSuccess) {
            return { success: true };
        } else {
            return { success: false, error: 'Some updates failed' };
        }
    } catch (error) {
        console.error('Error updating character:', error);
        return { success: false, error };
    }
}

async function basic(basic: BasicUpdateData, id: number): Promise<{ success: boolean; error?: any }> {
    if (!basic || typeof basic !== 'object') {
        console.error('Invalid basic data');
        return { success: false, error: 'Invalid basic data' };
    }

    const newObj = removeEmptyValues(basic);
    try {
        const { error, status, statusText } = await Supabase
            .from("character_basic")
            .update(newObj)
            .eq('num_id', id);

        if (error) {
            console.error('Error updating basic data:', error);
            return { success: false, error };
        }

        console.log('Basic data updated successfully:', { status, statusText });
        return { success: true };
    } catch (error) {
        console.error('Unexpected error updating basic data:', error);
        return { success: false, error };
    }
}
async function zenkaiAbilities(abilities: ZenkaiAbilities, id: number): Promise<{ success: boolean; error?: any }> {
    if (!abilities || typeof abilities !== 'object') {
        console.error('Invalid zenkai abilities data');
        return { success: false, error: 'Invalid zenkai abilities data' };
    }

    const newObj = removeEmptyValues(abilities);
    try {
        const { error, status, statusText } = await Supabase
            .from("character_zenkai_abilities")
            .update(newObj)
            .eq('_id', id);

        if (error) {
            console.error('Error updating zenkai abilities:', error);
            return { success: false, error };
        }

        console.log('Zenkai abilities updated successfully:', { status, statusText });
        return { success: true };
    } catch (error) {
        console.error('Unexpected error updating zenkai abilities:', error);
        return { success: false, error };
    }
}

async function abilities(abilities: Abilities, id: number): Promise<{ success: boolean; error?: any }> {
    if (!abilities || typeof abilities !== 'object') {
        console.error('Invalid abilities data');
        return { success: false, error: 'Invalid abilities data' };
    }

    const newObj = removeEmptyValues(abilities);
    try {
        const { error, status, statusText } = await Supabase
            .from("character_abilities")
            .update(newObj)
            .eq('_id', id);

        if (error) {
            console.error('Error updating abilities:', error);
            return { success: false, error };
        }

        console.log('Abilities updated successfully:', { status, statusText });
        return { success: true };
    } catch (error) {
        console.error('Unexpected error updating abilities:', error);
        return { success: false, error };
    }
}

async function zenkaiArts(arts: ZenkaiArts, id: number): Promise<{ success: boolean; error?: any }> {
    if (!arts || typeof arts !== 'object') {
        console.error('Invalid zenkai arts data');
        return { success: false, error: 'Invalid zenkai arts data' };
    }

    const newArts = removeEmptyValues(arts);
    try {
        const { error, status, statusText } = await Supabase
            .from("character_zenkai_arts")
            .update(newArts)
            .eq('_id', id);

        if (error) {
            console.error('Error updating zenkai arts:', error);
            return { success: false, error };
        }

        console.log('Zenkai arts updated successfully:', { status, statusText });
        return { success: true };
    } catch (error) {
        console.error('Unexpected error updating zenkai arts:', error);
        return { success: false, error };
    }
}

async function arts(arts: Arts, id: number): Promise<{ success: boolean; error?: any }> {
    if (!arts || typeof arts !== 'object') {
        console.error('Invalid arts data');
        return { success: false, error: 'Invalid arts data' };
    }

    const newArts = removeEmptyValues(arts);
    try {
        const { error, status, statusText } = await Supabase
            .from("character_arts")
            .update(newArts)
            .eq('_id', id);

        if (error) {
            console.error('Error updating arts:', error);
            return { success: false, error };
        }

        console.log('Arts updated successfully:', { status, statusText });
        return { success: true };
    } catch (error) {
        console.error('Unexpected error updating arts:', error);
        return { success: false, error };
    }
}

export const updateCharacter = {
    all,
    arts,
    abilities,
    zenkaiAbilities,
    zenkaiArts,
    basic
}