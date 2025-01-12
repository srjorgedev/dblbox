import express, { Request, Response, Application } from "express";
import characterRoutes from "./src/routes/character.routes";
import rateLimit from "express-rate-limit";

const app: Application = express();
const PORT = process.env.PORT;

app.set('trust proxy', true);

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

app.get("/helloworld", (_: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/api/v1/characters", characterRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});