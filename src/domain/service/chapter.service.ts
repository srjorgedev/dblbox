import { ChapterRepo } from "../repository/chapter.repo";

export class ChapterService {
    private readonly chapterRepo: ChapterRepo;

    constructor(chapterRepo: ChapterRepo) {
        this.chapterRepo = chapterRepo;
    }

    async findAllChapters(lang: string) {
        try {
            return await this.chapterRepo.findAll(lang);
        } catch (error) {
            throw error;
        }
    }

    async findChapterByID(id: number, lang: string) {
        try {
            return await this.chapterRepo.findByID(id, lang);
        } catch (error) {
            throw error;
        }
    }
}
