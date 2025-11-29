type DataOut = {
    id: number;
    content: Record<string, string>
}

export type TRUnit = {
    id: string;
    num: number;
    type: number;
    chapter: number;
    rarity: number;
    lf: boolean;
    transform: boolean;
    tagswitch: boolean;
    zenkai: boolean;
}

export type TRUnitName = {
    num: number;
    unit: string;
    lang: string;
    content: string;
}

export type TSUnit = {
    id: string;
    num: number;
    transform: boolean;
    lf: boolean;
    zenkai: boolean;
    tagswitch: boolean;
    unit_names: DataOut[];
    rarity: DataOut;
    type: DataOut;
    chapter: DataOut;
    colors: DataOut[];
}