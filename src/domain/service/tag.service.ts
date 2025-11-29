import { TagRepo } from "../repository/tag.repo";
import type { TSTag } from "../../models/tag.type";

export class TagService {
    private readonly tagRepo: TagRepo;

    constructor(tagRepo: TagRepo) {
        this.tagRepo = tagRepo;
    }

    async readAll(): Promise<TSTag[]> {
        const data = await this.tagRepo.readAll();
        const rows = data.rows

        const tagsMap: Map<number, TSTag> = new Map();

        for (const row of rows) {
            const tag_id = Number(row["tag_id"]);
            const tag_name = String(row["tag_name"]);
            const lang_code = String(row["lang_code"]);

            if (!tagsMap.has(tag_id)) {
                tagsMap.set(tag_id, { id: tag_id, texts: {} });
            }

            tagsMap.get(tag_id)!.texts[lang_code] = tag_name;
        }

        return Array.from(tagsMap.values());
    }
}