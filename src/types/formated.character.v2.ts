export interface FormatedCharacterV2 {
    basic: Basic
    abilities: Abilities
    arts: Arts
    zenkaiAbilities: ZenkaiAbilities
    zenkaiArts: ZenkaiArts
}

export interface Ability {
    title: string
    desc: string
}

export interface Basic {
    _id: string
    num: number
    name: string
    color: Color[] | Color
    type: Type[] | Type
    chapter: Chapter[] | Chapter
    rarity: Rarity[] | Rarity
    tags: Tag[] | Tag
    lf: boolean
    transformable: boolean
    switch: boolean
    zenkai: boolean
    fusion: boolean
    states: number
    zenkaiStates: number
}

export interface Color {
    _id?: number
    tag?: string
}

export interface Type {
    _id?: number
    tag?: string
}

export interface Chapter {
    _id?: number
    tag?: string
}

export interface Rarity {
    _id?: number
    tag?: string
}

export interface Tag {
    _id?: number
    tag?: string
}

export interface Abilities {
    zAbility: string[]
    main: Ability[]
    ultra: Ability[]
    unique1: Ability[]
    unique2: Ability[]
    limitedZ: string[]
}

export interface ZenkaiAbilities {
    main: Ability[]
    unique1: Ability[]
    unique2: Ability[]
    unique3: Ability[]
    unique4: Ability[]
    zenkaiAbility: string[]
}

export interface Arts {
    strike: Ability[]
    blast: Ability[]
    specialMove: Ability[]
    specialArt: Ability[]
    ultimate: Ability[]
    awaken: Ability[]
}

export interface ZenkaiArts {
    strike: Ability[]
    blast: Ability[]
    specialMove: Ability[]
    specialArt: Ability[]
    ultimate: Ability[]
    awaken: Ability[]
}
