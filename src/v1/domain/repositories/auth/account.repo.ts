import type * as Types from "@/types/account.types";
import { Client } from "@libsql/client";

export class AccountRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findByEmail(email: string): Promise<Types.Account> {
        const r = await this.db.execute({
            sql: `
SELECT 
	a.provider, a.provider_account_id, a.user_id, a.email, a.password_hash, u.role as role
FROM account a
LEFT JOIN user u ON u.id = a.user_id
WHERE a.email = ?
AND a.provider = 'credentials'
      `,
            args: [email]
        });

        return r.rows.length == 0 ? null : r.rows[0] as unknown as Types.Account;
    }

    async findByProvider(provider: string, providerAccountId: string): Promise<Types.Account> {
        const r = await this.db.execute({
            sql: `
SELECT 
	a.provider, a.provider_account_id, a.user_id, a.email, a.password_hash
FROM account a
WHERE provider = ?
AND provider_account_id = ?
    `,
            args: [provider, providerAccountId]
        });

        return r.rows[0] as unknown as Types.Account;
    }

    async create(data: Types.InsertAccount) {
        return this.db.execute({
            sql: `
        INSERT INTO account
        (provider, provider_account_id, user_id, email, password_hash)
        VALUES (?, ?, ?, ?, ?)
      `,
            args: [
                data.provider,
                data.provider_account_id,
                data.user_id,
                data.email,
                data.password_hash
            ]
        });
    }
}