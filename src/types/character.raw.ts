export interface RawCharacter {
    _id: string;
    num_id: number;
    name: string;
    color: string;
    type: string;
    chapter: string;
    tags: string;
    rarity: string;
    is_lf: boolean;
    transformable: boolean;
    tag_switch: boolean;
    revival: boolean;
    has_zenkai: boolean;
    abilities: Abilities;
    zenkai_abilities: ZenkaiAbilities;
    arts: Arts;
    zenkai_arts: Arts;
    created_at: Date;
    pictures: null;
    fusion: boolean;
}

export interface RawSummary {
    _id: string;
    num_id: number;
    name: string;
    color: string;
    type: string;
    chapter: string;
    tags: string;
    rarity: string;
    is_lf: boolean;
    transformable: boolean;
    tag_switch: boolean;
    revival: boolean;
    has_zenkai: boolean;
    fusion: boolean;
}

export interface Abilities {
    z: string;
    _id: number;
    main: string | null;
    ultra: string | null;
    ability_1: string;
    ability_2: string;
    z_limited: string | null;
    created_at: Date;
}

export interface Arts {
    _id: number;
    blast: string;
    awaken: string | null;
    strike: string;
    ultimate: string | null;
    created_at: Date;
    special_art: string;
    special_move: string;
}

export interface ZenkaiAbilities {
    _id: number;
    main: string | null;
    ability_1: string | null;
    ability_2: string | null;
    ability_3: string | null;
    ability_4: string | null;
    created_at: Date;
    zenkai_ability: string | null;
}
