
export type UserData = {
    readonly id: string;
    readonly username: string;
    readonly avatar: string;
}

export type User = {
    readonly id: string;
    readonly username: string;
    readonly avatar: string;
    readonly role_id: number;
    readonly role: string;
}