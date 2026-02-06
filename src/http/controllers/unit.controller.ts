import { UnitService } from "@/domain/service/unit.service";
import { Request, Response } from "express"
import type { Unit, UnitPOST, UnitUpdate, PaginatedResponse } from "@/types/unit.types";

export class UnitController {
    private readonly unitService: UnitService;

    constructor(unitService: UnitService) {
        this.unitService = unitService;
    }

    async createUnit(req: Request, res: Response) {
        const body = req.body as UnitPOST;
        const newUnit = await this.unitService.createUnit(body);
        return res.status(201).json(newUnit);
    }

    async updateUnit(req: Request, res: Response) {
        const id = String(req.params.id);
        const body = req.body as UnitUpdate;
        const updatedUnit = await this.unitService.updateUnit(id, body);
        return res.status(200).json(updatedUnit);
    }

    async getAllUnits(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const limit = req.query.limit
        const page = req.query.page
        const order = req.query.order == undefined ? "history" : req.query.order as string;

        if (!(["history", "rarity"].includes(order))) {
            return res.status(400).json({ message: "Invalid order" });
        }

        let response: PaginatedResponse<Unit>;

        if (limit == undefined && page == undefined) {
            response = await this.unitService.readAllUnits(lang, order);
        } else {
            response = await this.unitService.readAllUnitsPages(lang, Number(limit), Number(page), order);
        }

        return res.status(200).json(response);
    }

    async getUnit(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const id = String(req.params.id);

        let data: any;

        if (/^\d+$/.test(id)) data = await this.unitService.readUnitByNum(Number(id), lang)
        else data = await this.unitService.readUnitByID(id, lang);

        return res.status(200).json(data)
    }
}