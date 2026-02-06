import { Request, Response } from 'express';
import { AssetsService } from "@/domain/service/assets.service";

export class AssetsController {
    private readonly assetService: AssetsService;

    constructor(assetService: AssetsService) {
        this.assetService = assetService;
    }

    async getImage(req: Request, res: Response) {
        const { folder, fileName } = req.params;
        const file = `${folder}/${fileName}`;

        const filePath = await this.assetService.readAsset(file);

        res.sendFile(filePath);
    }
}