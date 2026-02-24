import { Request, Response } from "express";
import { UnitTagService } from "@/v1/domain/services/unit/unit_tag.service";
import { AppError } from "@/utils/AppError";

export class UnitTagController {
    private readonly service: UnitTagService;

    constructor(service: UnitTagService) {
        this.service = service;
    }

    // GET /api/v1/unit/tag/:id
    async getTags(req: Request, res: Response) {
        const id = req.params.id as string;
        const lang = (req.query.lang as string) || "en";
        const tags = await this.service.findByID(id, lang);
        res.status(200).json(tags);
    }

    // POST /api/v1/unit/tag
    async createTags(req: Request, res: Response) {
        const data = req.body;
        let result;

        if (Array.isArray(data)) {
            result = await this.service.insertMultiple(data);
        } else {
            result = await this.service.insertSingle(data);
        }

        res.status(201).json(result);
    }

    // DELETE /api/v1/unit/tag
    async deleteTags(req: Request, res: Response) {
        const data = req.body;
        let result;

        if (Array.isArray(data)) {
            result = await this.service.deleteMultiple(data);
        } else {
            result = await this.service.deleteSingle(data);
        }

        res.status(200).json(result);
    }
}
