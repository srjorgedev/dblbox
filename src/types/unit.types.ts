import { SupportedLangs } from "./lang.types";

export const SORT_TYPES = ["history", "rarity"] as const;
export type Sort = typeof SORT_TYPES[number];

export const JSON_COLUMNS = ["basic_json", "abilities_json", "zenkai_abilities_json"] as const;
export type JSONKeys = typeof JSON_COLUMNS[number];

export type UnitBasicResponse = Record<"basic_json", string>;
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
    readonly name: Name;
    readonly rarity: Simple;
    readonly chapter: Simple;
    readonly type: Simple;
    readonly color: Obj;
    readonly tags: Obj;
}

export type Name = {
    readonly count: number;
    readonly content: string[];
    readonly prefix: {
        readonly has_prefix: boolean;
        readonly content: string[] | [];
    }
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

export const UNIT_TABLES = ["unit", "unit_name", "unit_color", "unit_tag"] as const;
export const UNIT_NAME_TABLE_COLUMNS = ["num", "unit", "lang", "content", "prefix"] as const;
export const UNIT_BASIC_TABLE_COLUMNS = ["_id", "_num", "type", "chapter", "rarity", "lf", "transform", "zenkai", "tagswitch", "fusion"] as const;
export const UNIT_COLOR_TABLE_COLUMNS = ["number", "unit", "color"] as const;
export const UNIT_TAG_TABLE_COLUMNS = ["unit", "tag"] as const;

export const WHERE_CLAUSES = {
    "basic": "WHERE _id = ?",
    "name": "WHERE num = ? AND lang = ? AND unit = ?",
    "color": "WHERE number = ? AND unit = ?",
    "tag": "WHERE unit = ? and tag = ?"
}

export type Clauses = keyof typeof WHERE_CLAUSES;

export type UnitTables = typeof UNIT_TABLES[number];
export type UnitNamesColumns = typeof UNIT_NAME_TABLE_COLUMNS[number];
export type UnitBasicColumns = typeof UNIT_BASIC_TABLE_COLUMNS[number];
export type UnitColorColumns = typeof UNIT_COLOR_TABLE_COLUMNS[number];
export type UnitTagColumns = typeof UNIT_TAG_TABLE_COLUMNS[number];

export const TABLE_COLUMNS = {
    unit: UNIT_BASIC_TABLE_COLUMNS,
    unit_name: UNIT_NAME_TABLE_COLUMNS,
    unit_color: UNIT_COLOR_TABLE_COLUMNS,
    unit_tag: UNIT_TAG_TABLE_COLUMNS
} as const;

export type TableMap = {
    unit_name: UnitNameUpdate;
    unit: UnitBasicUpdate;
    unit_color: UnitColorUpdate;
}

export type UnitTag = {
    unit: string;
    tag: number;
    name?: string;
}

export type UnitColor = {
    number: number;
    unit: string;
    color: number;
    name?: string;
}

export type UnitColorUpdate = Partial<Omit<UnitColor, "num" | "unit">>

export type UnitBasic = {
    readonly _id: string;
    readonly _num: number;
    readonly type: number;
    readonly chapter: number;
    readonly rarity: number;
    readonly lf: boolean;
    readonly transform: boolean;
    readonly zenkai: boolean;
    readonly tagswitch: boolean;
    readonly fusion: boolean;
}

export type UnitBasicUpdate = Partial<Omit<UnitBasic, "_id">>

export type UnitName = {
    readonly num: number;
    readonly unit: string;
    readonly lang: SupportedLangs;
    readonly content: string;
    readonly prefix: string | null;
}

export type MultipleInsert = {
    readonly inserted: number;
    readonly totalRowsAffected: number;
}

export type BasicActionRequiered = {
    unit_id: string;
}

export type ColorActionRequiered = {
    unit: string;
    number: number;
}

export type NameActionRequiered = {
    num: number;
    lang: SupportedLangs;
    unit: string;
}

export type TagActionRequiered = {
    unit: string;
    tag: number;
}

export type UnitNameUpdate = Partial<UnitName>;
