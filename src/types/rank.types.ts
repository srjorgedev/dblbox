export type RankingItemsRaw = {
    readonly unit_id: string
    readonly unit_num: number
    readonly transform: number
    readonly lf: number
    readonly zenkai: number
    readonly tagswitch: number
    readonly fusion: number
    readonly unit_names: string
    readonly rarity_texts: string
    readonly type_texts: string
    readonly chapter_texts: string
    readonly color_texts: string
    readonly tag_texts: string;
    readonly avg_rank: string;
    readonly votes_count: string;
}

export type RankingParams = {
    rankingGroupId: string;
    date: string;
    windowDays: number;
    limit: number;
    snapshotDate: string;
    unitId: string;
    userId: string;
}

export type RankingParamsOpt = Partial<RankingParams>;