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

  getAll(): Promise<ResultSet> {
    const query: string = `SELECT _id FROM color`;
    return this.conn.execute(query);
  }

  create(color: Color): Promise<ResultSet> {
    const query: string = `INSERT INTO color (_id) VALUES (?)`;
    return this.conn.execute(query, [color.id]);
  }
}