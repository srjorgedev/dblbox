export type Insert = {
    user_id: string;
    unit_id: string;
    value: string;
}

export type Destiny = "unit" | "equipment";
export type DBResponse = {
    unit_id: string;
    ally_id: string;
    equipment_id: string;
    amount: number;
}

export type DBResponseUnit = Omit<DBResponse, "equipment_id">;
export type DBResponseEquip = Omit<DBResponse, "unit_id">;