export interface RawEquipment {
    _id: number
    name: string
    traits: string
    rarity: number
    slot1: string
    slot2: string
    slot3: string
    slot4: null
}

export interface RawSummaryEquipment {
    _id: number
    rarity: number
    traits: string
}