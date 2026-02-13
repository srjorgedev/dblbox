import { UnitService } from "@/domain/service/unit.service";
import { Request, Response } from "express"
import type { Unit, UnitPOST, UnitUpdate, PaginatedResponse } from "@/types/unit.types";

export class UnitController {
    private readonly unitService: UnitService;

    constructor(unitService: UnitService) {
        this.unitService = unitService;
    }

    async createUnit(req: Request, res: Response) {
        const body = { ...req.body };

        // Parse numeric fields if they are strings (typical in form data)
        const numericFields = ['num', 'type', 'rarity', 'chapter'];
        numericFields.forEach(field => {
            if (body[field] !== undefined && typeof body[field] === 'string') {
                const val = Number(body[field]);
                if (!isNaN(val)) body[field] = val;
            }
        });

        // Parse boolean fields if they are strings
        const booleanFields = ['transform', 'lf', 'zenkai', 'tagswitch', 'fusion'];
        booleanFields.forEach(field => {
            if (body[field] !== undefined && typeof body[field] === 'string') {
                body[field] = body[field].toLowerCase() === 'true' || body[field] === '1';
            }
        });

        // Parse arrays if they are strings (e.g. "1,2,3")
        const arrayFields = ['color', 'tags'];
        arrayFields.forEach(field => {
            if (body[field] !== undefined) {
                if (typeof body[field] === 'string') {
                    body[field] = body[field].split(',').map((item: string) => Number(item.trim())).filter((n: number) => !isNaN(n));
                } else if (Array.isArray(body[field])) {
                    body[field] = body[field].map((item: any) => Number(item)).filter((n: number) => !isNaN(n));
                }
            }
        });

        const newUnit = await this.unitService.createUnit(body as UnitPOST);
        return res.status(201).json({
            status: "success",
            statusCode: 201,
            message: "Unit created successfully"
        });
    }

    async updateUnit(req: Request, res: Response) {
        const id = String(req.params.id);
        const lang = req.query.lang == undefined ? "en" : req.query.lang as string;
        
        const body = { ...req.body };

        // Parse numeric fields if they are strings (typical in form data)
        const numericFields = ['num', 'type', 'rarity', 'chapter'];
        numericFields.forEach(field => {
            if (body[field] !== undefined && typeof body[field] === 'string') {
                const val = Number(body[field]);
                if (!isNaN(val)) body[field] = val;
            }
        });

        // Parse boolean fields if they are strings
        const booleanFields = ['transform', 'lf', 'zenkai', 'tagswitch', 'fusion'];
        booleanFields.forEach(field => {
            if (body[field] !== undefined && typeof body[field] === 'string') {
                body[field] = body[field].toLowerCase() === 'true' || body[field] === '1';
            }
        });

        // Parse arrays if they are strings (e.g. "1,2,3")
        const arrayFields = ['color', 'tags'];
        arrayFields.forEach(field => {
            if (body[field] !== undefined) {
                if (typeof body[field] === 'string') {
                    body[field] = body[field].split(',').map((item: string) => Number(item.trim())).filter((n: number) => !isNaN(n));
                } else if (Array.isArray(body[field])) {
                    body[field] = body[field].map((item: any) => Number(item)).filter((n: number) => !isNaN(n));
                }
            }
        });

        await this.unitService.updateUnit(id, body as UnitUpdate, lang);
        
        return res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Unit updated successfully"
        });
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

        if (/^\d+$/.test(id)) {
            data = await this.unitService.readUnitByNum(Number(id), lang);
        } else if (id.startsWith("DBL")) {
            data = await this.unitService.readUnitByID(id, lang);
        } else {
            data = await this.unitService.findUnitsByName(id, lang);
        }

        return res.status(200).json(data)
    }
}