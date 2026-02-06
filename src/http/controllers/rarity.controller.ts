import { RarityService } from "@/domain/service/rarity.service";
import { Request, Response } from "express";

export class RarityController {
    private readonly rarityService: RarityService;

    constructor(rarityService: RarityService) {
        this.rarityService = rarityService;
    }

    async getAllRarities(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const rarities = await this.rarityService.findAllRarities(lang);
        return res.status(200).json(rarities);
    }

    async getRarity(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const id = Number(req.params.id);
        const rarity = await this.rarityService.findRarityByID(id, lang);
        return res.status(200).json(rarity);
    }
}
