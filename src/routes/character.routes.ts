import { getCharacter } from "../services/character.get.services";
import { basicFormat, summaryFormat } from "../utils/character.format";
import { Router, Request, Response } from 'express';
import { getData } from "../utils/invoque.data";

const router = Router();

let cachedCharacters: unknown;
let lastFetchTime: number;
const CACHE_EXPIRATION_TIME: number = 60 * 60 * 1000;

// router.get("/get/all", async (_: Request, res: Response) => {
//     const currentTime: number = Date.now();

//     if (cachedCharacters && (currentTime - lastFetchTime) < CACHE_EXPIRATION_TIME) {
//         console.log("Usando datos de caché");
//         return res.json(cachedCharacters);
//     }

//     const characters = await getCharacter.all();

//     const formatedCharacters = await Promise.all(
//         characters.map((character) => basicFormat(character))
//     );

//     cachedCharacters = formatedCharacters;
//     lastFetchTime = currentTime;

//     return res.json(formatedCharacters);
// });

router.get("/get/summary/all", async (_: Request, res: Response) => {
    const currentTime: number = Date.now();
    const data = await getData()

    if (cachedCharacters && (currentTime - lastFetchTime) < CACHE_EXPIRATION_TIME) {
        console.log("Usando datos de caché");
        return res.json(cachedCharacters);
    }

    const characters = await getCharacter.summaryAll();

    const formatedCharacters = characters.map((character) => summaryFormat(character, data))

    cachedCharacters = formatedCharacters;
    lastFetchTime = currentTime;

    return res.json(formatedCharacters);
});

router.get("/get/:idNUM", async (req: Request<{ idNUM: string }>, res: Response) => {
    const id = parseInt(req.params.idNUM);
    let formatedCharacters;
    const data = await getData()

    try {
        const characters = await getCharacter.byNumID(id);
        formatedCharacters = basicFormat(characters, data);
    } catch (error) {
        if (error instanceof Error) return res.status(404).json({ error: error.message });
    }

    res.json(formatedCharacters);
});

// router.post("/update/:idNUM", async (req: Request<{ idNUM: string }>, res: Response) => {
//     const id = parseInt(req.params.idNUM);
// })

export default router;