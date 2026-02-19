export const SORT_TYPES = ["history", "rarity"] as const;
export type Sort = typeof SORT_TYPES[number];

export const JSON_COLUMNS = ["basic_json", "abilities_json", "zenkai_abilities_json"] as const;
export type JSONKeys = typeof JSON_COLUMNS[number];

export type DBArrResponse<T extends JSONKeys> = Record<T, string>[];
export type DBAllResponse = Record<JSONKeys, string>;
export type ServiceResponse = ""