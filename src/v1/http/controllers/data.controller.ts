import { Request, Response } from "express";
import { DataService } from "@/v1/domain/services";
import { AppError } from "@/utils/AppError";

export class DataController {
    private readonly service: DataService;

    constructor(service: DataService) {
        this.service = service;
    }

    // Route -> GET api/v1/data/${data}/all
    async getAll(req: Request, res: Response) {
        const lang = (req.query.lang as string) || "en";

        const data = await this.service.findAll(lang)

        return res.status(200).json(data)
    }

    // Route -> GET api/v1/data/%{data}/:id
    async getByID(req: Request, res: Response) {
        const lang = (req.query.lang as string) || "en";
        const id = req.params.id;

        if (isNaN(Number(id))) throw new AppError("wiuiiuui", 400);

        const data = await this.service.findByID(Number(id), lang);

        return res.status(200).json(data)
    }
}