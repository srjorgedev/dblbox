import { Supabase } from "../database/supabase";

async function getAll() {
    try {
        const { data, error } = await Supabase
            .from("equipments")
            .select("*")

        if (error) throw new Error(error.message)

        return data
    } catch (error) {
        return error
    }
}

async function getByID(id: number) {
    try {
        const { data, error } = await Supabase
            .from("equipments")
            .select("*")
            .eq("_id", id)

        if (error) throw new Error(error.message)

        return data[0]
    } catch (error) {
        return error
    }
}

async function getSummaryAll() {
    try {
        const { data, error } = await Supabase
            .from("equipments")
            .select("_id, rarity(_id, es), traits")

        if (error) throw new Error(error.message)
        return data
    } catch (error) {
        return error
    }
}

export const equipmentsGetServices = {
    getAll,
    getByID,
    getSummaryAll
}