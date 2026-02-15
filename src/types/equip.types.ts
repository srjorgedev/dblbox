export type Equip = {
    id: number;
    type: string;
    is_awaken: boolean;
    is_top: boolean;
    conditions: EquipCondition[];
    effects: EquipEffect[];
}

export type EquipEffect = {
    slot: number;
    effect: string;
}

export type EquipCondition = {
    condition_num: number;
    rules: EquipConditionRule[];
}

export type EquipConditionRule = {
    type: 'unit' | 'tag' | 'type' | 'rarity' | 'chapter' | 'color';
    id: string;
    name?: string;
    lang?: string;
}
