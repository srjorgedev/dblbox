import { UnitService } from "../../domain/service/unit.service";
import { Request, Response } from "express"
import type { Unit } from "../../types/unit.types";

export class UnitController {
    private readonly unitService: UnitService;

    constructor(unitService: UnitService) {
        this.unitService = unitService;
    }

    async getAllUnits(req: Request, res: Response) {
        try {
            const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
            const limit = req.query.limit
            const page = req.query.page

            let units : Unit[]

            if (limit == undefined && page == undefined) {
                units = await this.unitService.readAllUnits(lang);
            } else {
                units = await this.unitService.readAllUnitsPages(lang, Number(limit), Number(page));
            }

            return res.status(200).json(units);
        } catch (error) {
            console.log("CONTROLLER -> " + error)
            return res.status(500).json(error);
        }
    }

    async getUnit(req: Request, res: Response) {
        try {
            const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
            const id = String(req.params.id);

            let data: any;

            if (/^\d+$/.test(id)) data = await this.unitService.readUnitByNum(Number(id), lang)
            else data = await this.unitService.readUnitByID(id, lang);

            return res.status(200).json(data)
        } catch (error) {
            console.log("CONTROLLER -> " + error)
            return res.status(500).json(error);
        }
    }
}