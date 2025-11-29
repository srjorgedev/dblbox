import { conn } from "./src/db/conn"
import { LangRepo } from "./src/domain/repository/lang.repo"
import { ColorRepo } from "./src/domain/repository/color.repo";
import { TagRepo } from "./src/domain/repository/tag.repo";
import { ChapterRepo } from "./src/domain/repository/chapter.repo";
import { TypeRepo } from "./src/domain/repository/type.repo";
import { RarityRepo } from "./src/domain/repository/rarity.repo";
import { TagTextsRepo } from "./src/domain/repository/tag_texts.repo";
import { TagService } from "./src/domain/service/tag.service";
import { AbilityTypeService } from "./src/domain/service/ability_type.service";
import { AbilityTypeRepo } from "./src/domain/repository/ability_type.repo";
import { ColorService } from "./src/domain/service/color.service";
import { ChapterService } from "./src/domain/service/chapter.service";
import { UnitNameRepo } from "./src/domain/repository/name.repo";
import { UnitRepo } from "./src/domain/repository/unit.repo";
import { UnitService } from "./src/domain/service/unit.service";

const sUnit = new UnitService(new UnitRepo(conn.conn))
const unit = await sUnit.findByID("DBL87-03S")

const units = await sUnit.findAllWithPages(1, 10)
