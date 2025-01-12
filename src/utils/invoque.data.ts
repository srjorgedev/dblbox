import { getColor, getChapter, getTag, getRarity, getType } from "../services/data.services";
import { Data } from "../types/data";

let tag: Data[] = [], chapter: Data[] = [], color: Data[] = [], rarity: Data[] = [], type: Data[] = [];

export async function getData() {
    if (!(tag.length > 0) || !(chapter.length > 0) || !(color.length > 0) || !(rarity.length > 0) || !(type.length > 0)) {
        tag = await getTag();
        chapter = await getChapter();
        color = await getColor();
        rarity = await getRarity();
        type = await getType();
    }

    return { tag, chapter, color, rarity, type };
}
