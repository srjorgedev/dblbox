import { Client } from "@libsql/client";
import type * as Types from "@/types/user.types"

export class UserRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findByID(id: string): Promise<Types.User> {
        const r = await this.db.execute({
            sql: `
SELECT 
	u.id, 
	u.username, 
	u.avatar, 
	r.id as role_id,
	r.content as role
FROM user u
LEFT JOIN role r ON u.role = r.id
WHERE u.id = ?
            `,
            args: [id]
        });

        return r.rows[0] as unknown as Types.User;
    }

    async create(data: Types.UserData) {
        const r = await this.db.execute({
            sql: 'INSERT INTO user (id, username, avatar) VALUES (?, ?, ?)',
            args: [data.id, data.username, data.avatar]
        });

        return this.findByID(data.id);
    }

    async update(id: string, data: Types.UserData) {
        const { username, avatar } = data;

        await this.db.execute({
            sql: 'UPDATE user SET username = ?, avatar = ? WHERE id = ?',
            args: [username, avatar, id]
        });

        return this.findByID(id);
    }
}