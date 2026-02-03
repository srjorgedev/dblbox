import { ColorRepo } from "../repository/color.repo";

export class ColorService {
    private readonly colorRepo: ColorRepo;

    constructor(colorRepo: ColorRepo) {
        this.colorRepo = colorRepo;
    }

    async findAllColors(lang: string) {
        try {
            return await this.colorRepo.findAll(lang);
        } catch (error) {
            throw error;
        }
    }

    async findColorByID(id: number, lang: string) {
        try {
            return await this.colorRepo.findByID(id, lang);
        } catch (error) {
            throw error;
        }
    }
}
