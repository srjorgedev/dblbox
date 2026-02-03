import { TypeRepo } from "../repository/type.repo";

export class TypeService {
    private readonly typeRepo: TypeRepo;

    constructor(typeRepo: TypeRepo) {
        this.typeRepo = typeRepo;
    }

    async findAllTypes(lang: string) {
        try {
            return await this.typeRepo.findAll(lang);
        } catch (error) {
            throw error;
        }
    }

    async findTypeByID(id: number, lang: string) {
        try {
            return await this.typeRepo.findByID(id, lang);
        } catch (error) {
            throw error;
        }
    }
}
