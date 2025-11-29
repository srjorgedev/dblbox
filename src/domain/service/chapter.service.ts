import { ChapterRepo } from "../repository/chapter.repo";
import type { TSChapter } from "../../models/chapter.type";

export class ChapterService {
    private readonly chapterRepo: ChapterRepo;

    constructor(chapterRepo: ChapterRepo) {
        this.chapterRepo = chapterRepo;
    }

    async readAll(): Promise<TSChapter[]> {
        const data = await this.chapterRepo.readAll();
        const rows = data.rows

        const chaptersMap: Map<number, TSChapter> = new Map();

        for (const row of rows) {
            const chapter_id = Number(row["chapter_id"]);
            const chapter_name = String(row["chapter_name"]);
            const lang_code = String(row["lang_code"]);

            if (!chaptersMap.has(chapter_id)) {
                chaptersMap.set(chapter_id, { id: chapter_id, texts: {} });
            }

            chaptersMap.get(chapter_id)!.texts[lang_code] = chapter_name;
        }

        return Array.from(chaptersMap.values());
    }

    async create(): Promise<any> {
        return await this.chapterRepo.create();
    }
}
