import { Request, Response } from "express";
import { UnitNameService } from "@/v1/domain/services/unit/unit_name.service";
import { AppError } from "@/utils/AppError";

export class UnitNameController {
    private readonly service: UnitNameService;

    constructor(service: UnitNameService) {
        this.service = service;
    }

    // GET /api/v1/unit/name/:id
    async getNames(req: Request, res: Response) {
        const id = req.params.id as string;
        const lang = (req.query.lang as string) || "en";
        const result = await this.service.findByID(id, lang);
        res.status(200).json(result);
    }

    // POST /api/v1/unit/name
    async createNames(req: Request, res: Response) {
        const data = req.body;
        let result;

        if (Array.isArray(data)) {
            result = await this.service.insertMultiple(data);
        } else {
            result = await this.service.insertSingle(data);
        }

        res.status(201).json(result);
    }

    // PATCH /api/v1/unit/name
    async updateNames(req: Request, res: Response) {
        const { prev, next } = req.body;
        let result;

        if (Array.isArray(prev) && Array.isArray(next)) {
            result = await this.service.updateMultiple(prev, next);
        } else {
            result = await this.service.updateSingle(prev, next);
        }

        res.status(200).json(result);
    }

    // DELETE /api/v1/unit/name
    async deleteNames(req: Request, res: Response) {
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
