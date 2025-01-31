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

export async function signOutService() {
    const { data } = await Supabase.auth.getSession()
    if (data.session === null) throw new Error("No session found")

    const { error } = await Supabase.auth.signOut({ scope: "global" })
    if (error) throw new Error(error?.message)

    return;
}

export async function hasSessionService() { 
    const { data } = await Supabase.auth.getSession()
    return data.session !== null
}