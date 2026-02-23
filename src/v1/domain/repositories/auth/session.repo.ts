import type * as Types from "@/types/session.types";
import { Client } from "@libsql/client";

export class SessionRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async create(data: Types.Session) {
        return this.db.execute({
            sql: `
        INSERT INTO session
        (id, user_id, refresh_token_hash, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?)
      `,
            args: [
                data.id,
                data.user_id,
                data.refresh_token_hash,
                data.expires_at,
                data.created_at
            ]
        });
    }

    async findById(id: string): Promise<Types.Session> {
        const r = await this.db.execute({
            sql: `SELECT id, user_id, refresh_token_hash, expires_at, created_at FROM session WHERE id = ?`,
            args: [id]
        });

        return r.rows[0] as unknown as Types.Session;
     }

    async delete(id: string) {
        return this.db.execute({
            sql: `DELETE FROM session WHERE id = ?`,
            args: [id]
        });
    }

    async deleteByUser(userId: string) {
        return this.db.execute({
            sql: `DELETE FROM session WHERE user_id = ?`,
            args: [userId]
        });
    }
}