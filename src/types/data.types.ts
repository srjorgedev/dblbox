export const TABLES_ARRAY = ["tag", "type", "chapter", "color", "rarity"] as const;
export type Table = typeof TABLES_ARRAY[number]; 

export type Data = {
    id: number;
    name: string;
}