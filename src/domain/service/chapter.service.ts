import { ChapterRepo } from "@/domain/repository/chapter.repo";
import { AppError } from "@/utils/AppError";

export class ChapterService {
    private readonly chapterRepo: ChapterRepo;

    constructor(chapterRepo: ChapterRepo) {
        this.chapterRepo = chapterRepo;
    }

    async findAllChapters(lang: string) {
        return await this.chapterRepo.findAll(lang);
    }

    async findChapterByID(id: number, lang: string) {
        const chapter = await this.chapterRepo.findByID(id, lang);
        if (!chapter) throw new AppError(`Chapter with ID ${id} not found`, 404);
        return chapter;
    }
}
