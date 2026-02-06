import { ColorService } from "@/domain/service/color.service";
import { Request, Response } from "express";

export class ColorController {
    private readonly colorService: ColorService;

    constructor(colorService: ColorService) {
        this.colorService = colorService;
    }

    async getAllColors(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const colors = await this.colorService.findAllColors(lang);
        return res.status(200).json(colors);
    }

    async getColor(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const id = Number(req.params.id);
        const color = await this.colorService.findColorByID(id, lang);
        return res.status(200).json(color);
    }
}
