import { TypeRepo } from "@/domain/repository/type.repo";
import { AppError } from "@/utils/AppError";

export class TypeService {
    private readonly typeRepo: TypeRepo;

    constructor(typeRepo: TypeRepo) {
        this.typeRepo = typeRepo;
    }

    async findAllTypes(lang: string) {
        return await this.typeRepo.findAll(lang);
    }

    async findTypeByID(id: number, lang: string) {
        const type = await this.typeRepo.findByID(id, lang);
        if (!type) throw new AppError(`Type with ID ${id} not found`, 404);
        return type;
    }
}
