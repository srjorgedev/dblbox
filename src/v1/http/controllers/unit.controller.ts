import { Request, Response } from "express";
import { UnitService } from "@/v1/domain/services/unit.service";
import * as Types from "@/types/unit.types"
import { AppError } from "@/utils/AppError";

export class UnitController {
    private readonly service: UnitService;

    constructor(service: UnitService) {
        this.service = service;
    }

    // Route -> GET api/v1/unit/all
    async getUnits(req: Request, res: Response) {
        const lang = (req.query.lang as string) || "en";
        const sort = (req.query.sort as string as Types.Sort) || "history";

        if (!(Types.SORT_TYPES as readonly string[]).includes(sort)) {
            throw new AppError("Invalid sort type", 400);
        }

        const limit = Math.max(1, Number(req.query.limit) || 1000);
        const page = Math.max(1, Number(req.query.page) || 1);

        const data = await this.service.findPage(limit, page, lang, sort);

        res.status(200).json(data)
    }

    // Route -> GET api/v1/unit/:id
    async getUnit(req: Request, res: Response) {
        const lang = (req.query.lang as string) || "en";
        const { id } = req.params

        let data;

        if (!isNaN(Number(id))) {
            data = await this.service.findByNUM(Number(id), lang);
        }

        if (isNaN(Number(id))) {
            data = await this.service.findByID(String(id), lang);
        }

        res.status(200).json(data)
    }
}

