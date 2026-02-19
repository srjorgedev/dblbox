export const SORT_TYPES = ["history", "type"] as const;
export type Sort = typeof SORT_TYPES[number];

export const JSON_COLUMNS = ["equipment_json", "effects_list", "conditions_list"] as const;
export type JSONKeys = typeof JSON_COLUMNS[number];

export type DBArrResponse<T extends JSONKeys> = Record<T, string>[];
export type DBAllResponse = Record<JSONKeys, string>;
export type ServiceResponse = ""