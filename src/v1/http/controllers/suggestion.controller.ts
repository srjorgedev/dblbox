import { AppError } from "@/utils/AppError";
import { SuggestionService } from "@/v1/domain/services";
import { Request, Response } from "express";
import type * as Types from "@/types/suggestion.types";
import type * as LangTypes from "@/types/lang.types";
import { DEFAULT_LANG } from "@/types/lang.types";

export class SuggestionController {
    private readonly service: SuggestionService;

    constructor(service: SuggestionService) {
        this.service = service;
    }

    // Route POST -> /community/suggestion/:destiny/:id
    async post(req: Request, res: Response) {
        const unitID = (req.params.id as string) || null;
        const allyID = (req.body.ally_id as string) || null;
        const equipID = (req.body.equipment_id as string) || null;
        const destiny = (req.body.destiny as string) as Types.Destiny || null;
        const userID = req.user?.id;

        if (!destiny) throw new AppError("Erroruski", 400);
        if (!unitID) throw new AppError("Erroruski", 400);
        if (!userID) throw new AppError("Erroruski", 400);
        if (!allyID) throw new AppError("Erroruski", 400);
        if (!equipID) throw new AppError("Erroruski", 400);

        let data;

        switch (destiny) {
            case "equipment":
                data = await this.service.insertByEquip({ unit_id: unitID, user_id: userID, value: equipID });
                break;
            case "unit":
                data = await this.service.insertByUnit({ unit_id: unitID, user_id: userID, value: allyID });
                break;
            default: throw new AppError("Erroruski", 400);
        }

        res.status(200).json(data);
    }

    async get(req: Request, res: Response) {
        const lang = (req.query.lang as string) as LangTypes.SupportedLangs || DEFAULT_LANG;
        const unitID = (req.params.id as string) || null;
        const destiny = (req.query.from as string) as Types.Destiny || null;

        if (!unitID) throw new AppError("Erroruski con la unidad", 400);
        if (!destiny) throw new AppError("Erroruski con el destino", 400);

        let data;

        switch (destiny) {
            case "equipment":
                data = await this.service.findByEquip(unitID, lang);
                break;
            case "unit":
                data = await this.service.findByUnit(unitID, lang);
                break;
            default: throw new AppError("Erroruski", 400);
        }

        res.status(200).json(data);
    }
}