export interface Data {
    _id: number;
    es: string;
}

export interface DataArray {
    tag: Data[];
    chapter: Data[];
    color: Data[];
    rarity: Data[];
    type: Data[];
}