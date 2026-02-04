export type Unit = {
    readonly _id: string;
    readonly num: number;
    readonly transform: boolean;
    readonly lf: boolean;
    readonly zenkai: boolean;
    readonly tagswitch: boolean;
    readonly fusion: boolean;
    readonly states: number;
    readonly name: DataArray;
    readonly rarity: DataSimple;
    readonly chapter: DataSimple;
    readonly type: DataSimple;
    readonly color: DataObject;
    readonly tags: DataObject;
}

export type DataSimple = {
    readonly id: number;
    readonly name: string;
}

export type DataObject = {
    readonly count: number;
    readonly content: DataSimple[];
}

export type DataArray = {
    readonly count: number;
    readonly content: string[];
}

export type UnitPOST = {
    readonly id: string;
    readonly num: number;
    readonly type: number;
    readonly rarity: number;
    readonly chapter: number;
    readonly transform: boolean;
    readonly lf: boolean;
    readonly zenkai: boolean;
    readonly tagswitch: boolean;
    readonly fusion: boolean;
    readonly name: NamesPOST[];
    readonly color: number[];
    readonly tags: number[];
    readonly abilities: AbilityPOST[];
}

export type UnitUpdate = Partial<UnitPOST>;

export type NamesPOST = {
    num: string;
    lang: string;
    names: string;
}

export type AbilityPOST = {
    number: number;
    isZenkai: boolean;
    lang: string;
    title: string;
    content: string;
    abilityType: number;
}

export type MetaData = {
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    nextPage?: number | null;
    prevPage?: number | null;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
}

export type PaginatedResponse<T> = {
    meta: MetaData;
    data: T[];
}