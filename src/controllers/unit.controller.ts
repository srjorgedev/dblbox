import e, { Request, Response, Router } from "express"
import { UnitService } from "../domain/service/unit.service";
import { log } from "../utils/log";

export class UnitController {
    private readonly unitService: UnitService;

    constructor(UnitService: UnitService) {
        this.unitService = UnitService;

        this.getAllWithPages = this.getAllWithPages.bind(this);
    }

    async getAllWithPages(req: Request, res: Response) {
        try {
            const { page, limit } = req.query;
            let units = []
            let pagination: null | {} = null

            if (page == undefined && limit == undefined) {
                log("[UNIT CONTROLLER]: Route without queries")

                units = await this.unitService.findAll()
            } else {
                log("[UNIT CONTROLLER]: Route with queries")

                let targetPage: number = Number(page)
                let targetLimit: number = Number(limit)

                if (!targetPage || targetPage == 0) targetPage = 1;
                if (!limit) throw new Error("Limit is required");

                units = await this.unitService.findAllWithPages(targetPage, targetLimit)

                const total = await this.unitService.count()
                const totalPages = Math.ceil(total / targetLimit)
                const hasNextPage = targetPage < totalPages
                const hasPrevPage = targetPage > 1

                pagination = {
                    page: targetPage,
                    limit: targetLimit,
                    counOnPage: units.length,
                    total: total,
                    totalPages: totalPages,
                    hasNextPage: hasNextPage,
                    hasPrevPage: hasPrevPage
                }
            }

            return res.status(200).json({
                metadata: {
                    status: 200,
                    pagination
                },
                units
            })
        } catch (error) {
            const err = error as Error
            log("[UNIT CONTROLLER]: Error -> " + err.stack)
            res.status(500).json({
                metadata: {
                    status: 500,
                    error: {
                        message: err.message,
                        name: err.name,
                        cause: err.cause
                    }
                },
                units: []
            })
        }
    }
}