// types/rank.types.ts

export type RankingGroup = {
    _id: string;
    type: 'global' | 'weekly' | 'monthly' | 'event';
    is_active: boolean;
    title?: string;
    description?: string;
}

export type RankingVote = {
    user_id: string;
    group_id: string;
    unit_id: string;
    position: number;
    date: string;
    created_at: string;
}

export type RankingEntry = {
    position: number;
    unit_id: string;
    unit_name?: string;
    score: number;
    avg_rank: number;
    votes: number;
    trend: number;
}

export type RankingRealtime = RankingEntry & {
    hourly_votes: number;
    last_vote: string | null;
}

export type RankingSnapshot = {
    date: string;
    generated_at: string;
    window_days: number;
    total_votes: number;
    total_units: number;
    ranking: RankingEntry[];
}

export type DBArrResponse<T extends string | number | symbol = "data"> = Record<T, string>[]; 
export type DBObjectResponse<T extends string | number | symbol = "data"> = Record<T, string>;

export const SORT_TYPES = ["position", "score", "votes", "trending", "recent"] as const;
export type Sort = typeof SORT_TYPES[number];