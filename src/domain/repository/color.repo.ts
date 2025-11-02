import type { Client, ResultSet } from "@libsql/client";
import type IRepository from "./repo.interface.ts";

type Color = {
  id: number;
};

export class ColorRepo implements IRepository<Color> {
  private readonly conn: Client;

  constructor(conn: Client) {
    this.conn = conn;
  }

  readAll(): Promise<ResultSet> {
    const query: string = `
        SELECT 
            color._id as color_id,
            color_texts.content as color_name,
            lang._code as lang_code
        FROM color
        JOIN color_texts ON color._id = color_texts.color
        JOIN lang ON color_texts.lang = lang._code
		ORDER BY color._id
        `;
    return this.conn.execute(query);
  }

  create(color: Color): Promise<ResultSet> {
    const query: string = `INSERT INTO color (_id) VALUES (?)`;
    return this.conn.execute(query, [color.id]);
  }
}