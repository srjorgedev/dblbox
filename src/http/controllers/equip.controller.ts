import { EquipService } from "@/domain/service/equip.service";
import { Request, Response } from "express";

export class EquipController {
    private readonly equipService: EquipService;

    constructor(equipService: EquipService) {
        this.equipService = equipService;
    }

    async getAllEquips(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const equips = await this.equipService.findAllEquips(lang);
        return res.status(200).json(equips);
    }

    async getEquip(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const id = Number(req.params.id);
        const equip = await this.equipService.findEquipByID(id, lang);
        return res.status(200).json(equip);
    }
}
