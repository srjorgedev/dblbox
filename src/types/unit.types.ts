export type Unit = {
    readonly _id: string;
    readonly num: number;
    readonly transform: boolean;
    readonly lf: boolean;
    readonly zenkai: boolean;
    readonly tagswitch: boolean;
    readonly name: DataArray;
    readonly rarity: DataSimple;
    readonly chapter: DataSimple;
    readonly type: DataSimple;
    readonly color: DataObject;
    readonly tags: DataObject;
}

export type DataSimple = {
    readonly id: number;
    readonly name: string;
}

export type DataObject = {
    readonly count: number;
    readonly content: DataSimple[];
}

export type DataArray = {
    readonly count: number;
    readonly content: string[];
}
