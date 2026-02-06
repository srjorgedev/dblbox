import { ChapterService } from "@/domain/service/chapter.service";
import { Request, Response } from "express";

export class ChapterController {
    private readonly chapterService: ChapterService;

    constructor(chapterService: ChapterService) {
        this.chapterService = chapterService;
    }

    async getAllChapters(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const chapters = await this.chapterService.findAllChapters(lang);
        return res.status(200).json(chapters);
    }

    async getChapter(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const id = Number(req.params.id);
        const chapter = await this.chapterService.findChapterByID(id, lang);
        return res.status(200).json(chapter);
    }
}
