import express, { Request, Response, Application } from "express";
import characterRoutes from "./routes/character.routes";
import rateLimit from "express-rate-limit";
import cors from 'cors'

const app: Application = express();
const PORT = process.env.PORT ?? 2323;

app.set('trust proxy', 'loopback');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(limiter);

app.get("/helloworld", (_: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/api/v1/characters", characterRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});