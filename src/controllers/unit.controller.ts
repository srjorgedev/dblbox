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

                if (isNaN(targetPage)) targetPage = 0;
                if (!limit || isNaN(targetLimit)) throw new Error("Limit is required and must be a number");

                units = await this.unitService.findAllWithPages(targetPage, targetLimit)
                pagination = {
                    page: targetPage,
                    limit: targetLimit,
                    total: units.length
                }
            }

            return res.status(200).json({
                metadata: {
                    status: 200,
                    pagination
                },
                units
            })
        } catch (error: any) {
            log("[UNIT CONTROLLER]: Error -> " + error.message);
            if (error.message === "Limit is required and must be a number") {
                 return res.status(400).json({
                    metadata: {
                        status: 400,
                        error: error.message
                    },
                    units: []
                })
            }
            return res.status(500).json({
                metadata: {
                    status: 500,
                    error: "Internal Server Error"
                },
                units: []
            })
        }
    }
}