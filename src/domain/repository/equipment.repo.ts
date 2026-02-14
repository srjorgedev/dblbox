import type { Client, ResultSet } from "@libsql/client"
import { log } from "../../utils/log"

type EquipBasic = {
    id: number;
    type: number;
    is_awaken: boolean;
    is_top: boolean;
    _from: number | null;
}

export class EquipmentRepo {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    create(data: EquipBasic): Promise<ResultSet> {
        const query: string = `INSERT INTO equipment (_id, type, is_awaken, is_top, _from) VALUES (?, ?, ?, ?, ?)`;
        return this.conn.execute(query, [data.id, data.type, data.is_awaken, data.is_top, data._from]);
    }
}
