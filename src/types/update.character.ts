export interface UpdateCharacter {
    basic?: BasicUpdateData
    abilities?: Abilities;
    zenkai_abilities?: ZenkaiAbilities;
    arts?: Arts;
    zenkai_arts?: Arts;
}

export interface BasicUpdateData {
    _id?: string;
    num_id?: number;
    name?: string;
    color?: string;
    type?: string;
    chapter?: string;
    tags?: string;
    rarity?: string;
    is_lf?: boolean;
    transformable?: boolean;
    tag_switch?: boolean;
    revival?: boolean;
    has_zenkai?: boolean;
    fusion?: boolean;
}

export interface RawSummary {
    _id?: string;
    num_id?: number;
    name?: string;
    color?: string;
    type?: string;
    chapter?: string;
    tags?: string;
    rarity?: string;
    is_lf?: boolean;
    transformable?: boolean;
    tag_switch?: boolean;
    revival?: boolean;
    has_zenkai?: boolean;
    fusion?: boolean;
}

export interface Abilities {
    z?: string;
    main?: string | null;
    ultra?: string | null;
    ability_1?: string;
    ability_2?: string;
    z_limited?: string | null;
}

export interface Arts {
    blast?: string;
    awaken?: string | null;
    strike?: string;
    ultimate?: string | null;
    special_art?: string;
    special_move?: string;
}

export interface ZenkaiAbilities {
    main?: string | null;
    ability_1?: string | null;
    ability_2?: string | null;
    ability_3?: string | null;
    ability_4?: string | null;
    zenkai_ability?: string | null;
}

export interface ZenkaiArts {
    blast?: string;
    awaken?: string | null;
    strike?: string;
    ultimate?: string | null;
    special_art?: string;
    special_move?: string;
}