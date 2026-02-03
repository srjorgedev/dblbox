import { TagService } from "../../domain/service/tag.service";
import { Request, Response } from "express";

export class TagController {
    private readonly tagService: TagService;

    constructor(tagService: TagService) {
        this.tagService = tagService;
    }

    async getAllTags(req: Request, res: Response) {
        try {
            const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
            const tags = await this.tagService.readAllTags(lang);
            return res.status(200).json(tags);
        } catch (error) {
            console.log("CONTROLLER -> " + error);
            return res.status(500).json(error);
        }
    }
}
