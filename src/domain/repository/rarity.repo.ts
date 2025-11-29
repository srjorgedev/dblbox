import type IRepository from "./repo.interface";
import type { Client, ResultSet } from "@libsql/client";

type Rarity = {
    id: number;
};

export class RarityRepo implements IRepository<Rarity> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    readAll(): Promise<ResultSet> {
        const query: string = `
        SELECT 
            rarity._id as rarity_id,
            rarity_texts.content as rarity_name,
            lang._code as lang_code
        FROM rarity
        JOIN rarity_texts ON rarity._id = rarity_texts.rarity
        JOIN lang ON rarity_texts.lang = lang._code
		ORDER BY rarity._id
        `;
        return this.conn.execute(query);
    }

    create(rarity: Rarity): Promise<ResultSet> {
        const query: string = `INSERT INTO rarity (_id) VALUES (?)`;
        return this.conn.execute(query, [rarity.id]);
    }
}