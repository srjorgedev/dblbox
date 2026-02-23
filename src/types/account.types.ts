export type InsertAccount = {
    provider: string;
    provider_account_id: string;
    user_id: string;
    email: string;
    password_hash: string | null;
}

export type Account = {
    provider: string;
    provider_account_id: string;
    user_id: string;
    email: string;
    password_hash: string | null;
    role: number;
} | null