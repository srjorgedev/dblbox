import type IRepository from "./repo.interface";
import type { ILonely } from "./repo.interface";
import type { Client, ResultSet } from "@libsql/client";
import type { TRAbility } from "../../models/ability.type";

export class AbilityRepo implements IRepository<TRAbility> {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    /*NOT IMPLEMENTED*/
    readAll(): Promise<ResultSet> {
        const query: string = `
        SELECT 
            ability._id as ability_id,
            ability_texts.content as ability_name,
            lang._code as lang_code
        FROM ability
        JOIN ability_texts ON ability._id = ability_texts.ability
        JOIN lang ON ability_texts.lang = lang._code
		ORDER BY ability._id
        `;
        return this.conn.execute(query);
    }

    /*
        Takes all abilities of an specified unit 
    */
    readAllByID(id: string): Promise<ResultSet> {
        const query: string = `SELECT * FROM ability WHERE unit = ?`;
        return this.conn.execute(query, [id]);
    
    }

    create(ability: TRAbility): Promise<ResultSet> {
        const query: string = `INSERT INTO ability (number, ability_type, unit, lang, title, content, zenkai) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        return this.conn.execute(query, [ability.number, ability.ability_type, ability.unit, ability.lang, ability.title, ability.content, ability.zenkai]);
    }
}