export interface CharacterUpdate {
    char: Char
}

export interface Char {
    basic: Basic
    abilities: Abilities
    zenkai_abilities: ZenkaiAbilities
    arts: Arts
    zenkai_arts: ZenkaiArts
}

export interface Basic {
    _id: string
    num_id: number
    name: string
    color: string
    type: string
    chapter: string
    tags: string
    rarity: string
    is_lf: boolean
    transformable: boolean
    tag_switch: boolean
    revival: boolean
    has_zenkai: boolean
    fusion: boolean
}

export interface ZenkaiAbilities {
    main: string
    ability_1: string
    ability_2: string
    ability_3: string
    ability_4: string
    zenkai_ability: string
}

export interface Abilities {
    z: string
    main: string
    ultra: string | null
    ability_1: string
    ability_2: string
    z_limited: string | null
}

export interface Arts {
    strike: string
    blast: string
    special_move: string
    special_art: string
    ultimate: string | null
    awaken: string | null
}

export interface ZenkaiArts {
    strike: string
    blast: string
    special_move: string
    special_art: string
    ultimate: string | null
    awaken: string | null
}
