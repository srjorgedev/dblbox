import { TagRepo } from "../repository/tag.repo";

export class TagService {
    private readonly tagRepo: TagRepo;

    constructor(tagRepo: TagRepo) {
        this.tagRepo = tagRepo;
    }

    async readAllTags(lang: string) {
        try {
            return await this.tagRepo.readAll(lang);
        } catch (error) {
            throw error;
        }
    }
}