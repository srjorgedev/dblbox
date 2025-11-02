import { conn } from "./src/db/conn.ts"
import { LangRepo } from "./src/domain/repository/lang.repo.ts"
import { ask } from "./src/utils/input.ts";
import { ColorRepo } from "./src/domain/repository/color.repo.ts";
import { TagRepo } from "./src/domain/repository/tag.repo.ts";
import { ChapterRepo } from "./src/domain/repository/chapter.repo.ts";
import { TypeRepo } from "./src/domain/repository/type.repo.ts";
import { RarityRepo } from "./src/domain/repository/rarity.repo.ts";
import { TagTextsRepo } from "./src/domain/repository/tag_texts.repo.ts";
import { TagService } from "./src/domain/service/tag.service.ts";
import { AbilityTypeService } from "./src/domain/service/ability_type.service.ts";
import { AbilityTypeRepo } from "./src/domain/repository/ability_type.repo.ts";
import { ColorService } from "./src/domain/service/color.service.ts";
import { ChapterService } from "./src/domain/service/chapter.service.ts";

const rAbilityTypeRepo = new AbilityTypeRepo(conn.conn);
const rAbilityTypeService = new AbilityTypeService(rAbilityTypeRepo);

const rTag = new TagRepo(conn.conn);
const sTag = new TagService(rTag);


const r = await rAbilityTypeService.readAll();
console.log(r);

const s = await sTag.readAll();
console.log(s);

const rColor = new ColorRepo(conn.conn);
const sColor = new ColorService(rColor);

const w = await sColor.readAll();
console.log(w);

const rChapter = new ChapterRepo(conn.conn);
const sChapter = new ChapterService(rChapter);

console.log(await sChapter.readAll())