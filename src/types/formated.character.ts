export interface FormatedCharacter {
    _id: string
    num: number
    name: string
    color: Color[] | Color
    type: Type [] | Type
    chapter: Chapter[] | Chapter
    rarity: Rarity[] | Rarity
    tags: Tag[] | Tag
    lf: boolean
    transformable: boolean
    switch: boolean
    zenkai: boolean
    abilities: Abilities
    zenkaiAbilities: ZenkaiAbilities | null
    arts: Arts
    zenkaiArts: ZenkaiArts | null
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

export interface Ability {
    Title: string,
    Description: string
}

export interface Abilities {
    zAbility: string[]
    main: string[][]
    ultra: string[][] | null
    unique1: string[][]
    unique2: string[][]
    limitedZ: string[] | null
}
export interface ZenkaiAbilities {
    main: string[][]
    unique1: string[][]
    unique2: string[][]
    unique3: string[][]
    unique4: string[][]
    zenkaiAbility: string[]
}

export interface Arts {
    strike: string[][]
    blast: string[][]
    specialMove: string[][]
    specialArt: string[][]
    ultimate: string[][] | null
    awaken: string[][] | null
}

export interface ZenkaiArts {
    strike: string[][]
    blast: string[][]
    specialMove: string[][]
    specialArt: string[][]
    ultimate: string[][] | null
    awaken: string[][] | null
}
