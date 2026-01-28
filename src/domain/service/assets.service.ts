import { AssetsRepo } from "../repository/assets.repo";

export class AssetsService {
    private readonly assetsRepo: AssetsRepo;

    constructor(assetsRepo: AssetsRepo) {
        this.assetsRepo = assetsRepo;
    }

    async readAsset(fileName: string): Promise<string> {
        const path = await this.assetsRepo.findImagePath(fileName);
        if (!path) throw new Error('Image not found');

        return path;
    }
}