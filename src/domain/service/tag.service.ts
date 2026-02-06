import { TagRepo } from "@/domain/repository/tag.repo";

export class TagService {
    private readonly tagRepo: TagRepo;

    constructor(tagRepo: TagRepo) {
        this.tagRepo = tagRepo;
    }

    async readAllTags(lang: string) {
        return await this.tagRepo.readAll(lang);
    }
}