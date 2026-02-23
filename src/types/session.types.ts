export type Session = {
    id: string;
    user_id: string;
    refresh_token_hash: string;
    expires_at: number;
    created_at: number;
}