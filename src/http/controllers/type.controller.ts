import { TypeService } from "@/domain/service/type.service";
import { Request, Response } from "express";

export class TypeController {
    private readonly typeService: TypeService;

    constructor(typeService: TypeService) {
        this.typeService = typeService;
    }

    async getAllTypes(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const types = await this.typeService.findAllTypes(lang);
        return res.status(200).json(types);
    }

    async getType(req: Request, res: Response) {
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        const id = Number(req.params.id);
        const type = await this.typeService.findTypeByID(id, lang);
        return res.status(200).json(type);
    }
}
