import { Request, Response } from "express";
import { UnitBasicService } from "@/v1/domain/services/unit/unit_basic.service";
import { UnitNameService } from "@/v1/domain/services/unit/unit_name.service";
import { UnitColorService } from "@/v1/domain/services/unit/unit_color.service";
import { UnitTagService } from "@/v1/domain/services/unit/unit_tag.service";
import { AppError } from "@/utils/AppError";

export class UnitCompositeController {
    constructor(
        private readonly sBasic: UnitBasicService,
        private readonly sName: UnitNameService,
        private readonly sColor: UnitColorService,
        private readonly sTag: UnitTagService
    ) {}

    // POST /api/v1/unit/full
    async createFullUnit(req: Request, res: Response) {
        const { basic, names, colors, tags } = req.body;

        if (!basic) throw new AppError("Basic unit data is required", 400);

        const results: any = {};

        // 1. Basic
        results.basic = await this.sBasic.insertSingle(basic);

        // 2. Names
        if (names) {
            results.names = Array.isArray(names) 
                ? await this.sName.insertMultiple(names) 
                : await this.sName.insertSingle(names);
        }

        // 3. Colors
        if (colors) {
            results.colors = Array.isArray(colors) 
                ? await this.sColor.insertMultiple(colors) 
                : await this.sColor.insertSingle(colors);
        }

        // 4. Tags
        if (tags) {
            results.tags = Array.isArray(tags) 
                ? await this.sTag.insertMultiple(tags) 
                : await this.sTag.insertSingle(tags);
        }

        res.status(201).json({
            message: "Full unit data processed",
            results
        });
    }

    // PATCH /api/v1/unit/full
    async updateFullUnit(req: Request, res: Response) {
        const { basic, names, colors } = req.body;
        const results: any = {};

        // 1. Basic Update
        if (basic) {
            const { prev, next } = basic;
            if (!prev || !next) throw new AppError("Basic update requires 'prev' and 'next' data", 400);
            
            results.basic = Array.isArray(prev)
                ? await this.sBasic.updateMultiple(prev, next)
                : await this.sBasic.updateSingle(prev, next);
        }

        // 2. Names Update
        if (names) {
            const { prev, next } = names;
            if (!prev || !next) throw new AppError("Names update requires 'prev' and 'next' data", 400);

            results.names = Array.isArray(prev)
                ? await this.sName.updateMultiple(prev, next)
                : await this.sName.updateSingle(prev, next);
        }

        // 3. Colors Update
        if (colors) {
            const { prev, next } = colors;
            if (!prev || !next) throw new AppError("Colors update requires 'prev' and 'next' data", 400);

            results.colors = Array.isArray(prev)
                ? await this.sColor.updateMultiple(prev, next)
                : await this.sColor.updateSingle(prev, next);
        }

        // Tags do not have an update method in this project's structure (they are typically deleted/re-inserted)

        res.status(200).json({
            message: "Full unit data updated",
            results
        });
    }
}
