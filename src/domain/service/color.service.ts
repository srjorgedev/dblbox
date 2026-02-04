import { ColorRepo } from "../repository/color.repo";
import { AppError } from "../../utils/AppError";

export class ColorService {
    private readonly colorRepo: ColorRepo;

    constructor(colorRepo: ColorRepo) {
        this.colorRepo = colorRepo;
    }

    async findAllColors(lang: string) {
        return await this.colorRepo.findAll(lang);
    }

    async findColorByID(id: number, lang: string) {
        const color = await this.colorRepo.findByID(id, lang);
        if (!color) throw new AppError(`Color with ID ${id} not found`, 404);
        return color;
    }
}
