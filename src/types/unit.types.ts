export const SORT_TYPES = ["history", "rarity"] as const;
export type Sort = typeof SORT_TYPES[number];

export const JSON_COLUMNS = ["basic_json", "abilities_json", "zenkai_abilities_json"] as const;
export type JSONKeys = typeof JSON_COLUMNS[number];

export type DBArrResponse<T extends JSONKeys> = Record<T, string>[];
export type DBAllResponse = Record<JSONKeys, string>;
export type ServiceResponse<T, K> = {
    meta: T;
    data: K;
};

export type PageMeta = {
    readonly elementsOnPage: number;
    readonly totalElements: number;
    readonly page: number;
    readonly limit: number;
    readonly totalPages: number;
    readonly nextPage: number | null;
    readonly prevPage: number | null;
    readonly hasNextPage: boolean;
    readonly hasPrevPage: boolean;
}

export type AllMeta = Pick<PageMeta, "totalElements">;
export type SingleMeta = {
    lang: string;
}

export type AbilityJSON = {
    readonly count: number;
    readonly content: AbilityContent[];
}

export type AbilityContent = {
    readonly number: number;
    readonly zenkai: boolean;
    readonly title: null | string;
    readonly content: string;
    readonly type: AbilityType;
}

export type Ability = {
    readonly count: number;
    readonly content: Record<string, AbilityContent[]>;
}

export type AbilityType = {
    readonly id: number;
    readonly name: string;
}

export type Unit = {
    basic: Basic;
    abilities: Ability;
    zenkaiAbilities: Ability;
}

export type Basic = {
    readonly _id: string;
    readonly num: number;
    readonly transform: boolean;
    readonly lf: boolean;
    readonly zenkai: boolean;
    readonly tagswitch: boolean;
    readonly fusion: boolean;
    readonly states: number;
    readonly name: Arr;
    readonly rarity: Simple;
    readonly chapter: Simple;
    readonly type: Simple;
    readonly color: Obj;
    readonly tags: Obj;
}

export type Simple = {
    readonly id: number;
    readonly name: string;
}

export type Obj = {
    readonly count: number;
    readonly content: Simple[];
}

export type Arr = {
    readonly count: number;
    readonly content: string[];
}
