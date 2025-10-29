import { conn } from "./src/db/conn.ts"
import { LangRepo } from "./src/domain/repository/lang.repo.ts"
import { ask } from "./src/utils/input.ts";
import { ColorRepo } from "./src/domain/repository/color.repo.ts";
import { TagRepo } from "./src/domain/repository/tag.repo.ts";
import { ChapterRepo } from "./src/domain/repository/chapter.tag.ts";
import { TypeRepo } from "./src/domain/repository/type.repo.ts";
import { RarityRepo } from "./src/domain/repository/rarity.repo.ts";
import { TagTextsRepo } from "./src/domain/repository/tag_texts.repo.ts";

console.clear();

const tag: string = await ask("Enter the tag id: ");
const lang: string = await ask("Enter language code: ");
const tag_name: string = await ask("Enter tag name: ");

const langRepo = new TagTextsRepo(conn.conn);
await langRepo.create({ id: 0, tag: parseInt(tag), lang: lang, content: tag_name });

const langs = await langRepo.getAll();
console.log(langs);

// const tagRepo = new TagRepo(conn.conn)
// const allTags = await tagRepo.getAll();

