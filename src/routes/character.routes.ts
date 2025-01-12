import { getCharacter } from "../services/character.get.services";
import { basicFormat } from "../utils/character.format";
import { Router, Request, Response } from 'express';

const router = Router();

let cachedCharacters: unknown;
let lastFetchTime: number;
const CACHE_EXPIRATION_TIME: number = 60 * 60 * 1000;

router.get("/get/all", async (_: Request, res: Response) => {
    const currentTime: number = Date.now();

    if (cachedCharacters && (currentTime - lastFetchTime) < CACHE_EXPIRATION_TIME) {
        console.log("Usando datos de caché");
        return res.json(cachedCharacters);
    }

    const characters = await getCharacter.all();

    const formatedCharacters = await Promise.all(
        characters.map((character) => basicFormat(character))
    );

    cachedCharacters = formatedCharacters;
    lastFetchTime = currentTime;

    return res.json(formatedCharacters);
});

router.get("/get/:idNUM", async (req: Request<{ idNUM: string }>, res: Response) => {
    const id = parseInt(req.params.idNUM);
    let formatedCharacters;

    try {
        const characters = await getCharacter.byNumID(id);
        formatedCharacters = await basicFormat(characters);
    } catch (error) {
        if (error instanceof Error) return res.status(404).json({ error: error.message });
    }

    res.json(formatedCharacters);
});

// router.post("/update/:idNUM", async (req: Request<{ idNUM: string }>, res: Response) => {
//     const id = parseInt(req.params.idNUM);
// })

export default router;