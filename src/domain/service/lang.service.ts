import { LangRepo } from "../repository/lang.repo";
import type { TSLang, TRLang } from "../../models/lang.type";

export class LangService {
    private readonly langRepo: LangRepo;

    constructor(langRepo: LangRepo) {
        this.langRepo = langRepo;
    }

    async readAll(): Promise<TSLang[]> {
        const data = await this.langRepo.readAll();
        const rows = data.rows;

        const results: TSLang[] = rows.map(row => ({
            code: String(row["Code"]),
            name: String(row["Name"]),
        }));

        return results;
    }

    async create(lang: TRLang): Promise<any> {
        return await this.langRepo.create(lang);
    }
}
