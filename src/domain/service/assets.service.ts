import { AssetsRepo } from "../repository/assets.repo";
import { AppError } from "../../utils/AppError";

export class AssetsService {
    private readonly assetsRepo: AssetsRepo;

    constructor(assetsRepo: AssetsRepo) {
        this.assetsRepo = assetsRepo;
    }

    async readAsset(fileName: string): Promise<string> {
        const path = await this.assetsRepo.findImagePath(fileName);
        if (!path) throw new AppError('Image not found', 404);

        return path;
    }
}