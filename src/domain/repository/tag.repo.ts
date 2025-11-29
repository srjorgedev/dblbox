import type { Client, ResultSet } from "@libsql/client";
import type IRepository from "./repo.interface";
import type { ILonely } from "./repo.interface";
import type { TRTag } from "../../models/tag.type";

export class TagRepo implements IRepository<TRTag>, ILonely {
    private readonly conn: Client;

    constructor(conn: Client) {
        this.conn = conn;
    }

    readAll(): Promise<ResultSet> {
        const query: string = `
        SELECT 
            tag._id as tag_id,
            tag_texts.content as tag_name,
            lang._code as lang_code
        FROM tag
        JOIN tag_texts ON tag._id = tag_texts.tag
        JOIN lang ON tag_texts.lang = lang._code
		ORDER BY tag._id
        `;
        return this.conn.execute(query);
    }

    create(): Promise<ResultSet> {
        const query: string = `INSERT INTO tag DEFAULT VALUES`;
        return this.conn.execute(query)
    }
}