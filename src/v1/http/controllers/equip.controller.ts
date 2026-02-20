import { Request, Response } from "express";
import { EquipService } from "@/v1/domain/services";
import * as Types from "@/types/equip.types";
import { AppError } from "@/utils/AppError";

export class EquipController {
    private readonly service: EquipService;

    constructor(service: EquipService) {
        this.service = service;
    }

    // Route -> GET api/v1/equip/all
    async getEquips(req: Request, res: Response) {
        const lang = (req.query.lang as string) || "en";
        const sort = (req.query.sort as string as Types.Sort) || "history";
        const unit = (req.query.unit as string) || null;

        if (!(Types.SORT_TYPES as readonly string[]).includes(sort)) {
            throw new AppError("Invalid sort type", 400);
        }

        let data;

        if (unit === null) {
            const limit = Math.max(1, Number(req.query.limit) || 1000);
            const page = Math.max(1, Number(req.query.page) || 1);

            data = await this.service.findPage(limit, page, lang, sort);
        }

        if (unit != null) {
            data = await this.service.findByUnit(unit, lang)
        }

        res.status(200).json(data)
    }

    // Route -> GET api/v1/equip/:id
    async getEquip(req: Request, res: Response) {
        const lang = (req.query.lang as string) || "en";
        const units = (Boolean(req.query.units)) || false;
        const { id } = req.params

        if (isNaN(Number(id))) throw new AppError("erruski", 400);

        let data;

        if (!units) data = await this.service.findByID(Number(id), lang); 
        if (units) data = await this.service.findUnits(Number(id), lang)

        res.status(200).json(data)
    }
}