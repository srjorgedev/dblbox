import { Supabase } from "../database/supabase";

export async function logInService(email: string, password: string) {
    const { data, error } = await Supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) throw new Error(error?.message)

    return {
        user: data.user,
        session: data.session
    }
}