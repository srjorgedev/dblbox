import "dotenv/config"
import express, { Request, Response, Application } from "express";
import characterGetRoutes from "./routes/character.get.routes";
import characterUpdateRoutes from "./routes/character.update.routes";
import characterGetRoutesV2 from "./routes/v2/character.get.routes";
import dataRoutes from "./routes/data.get.routes"
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

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: ['https://www.dbl-box.com', 'https://dbl-box.com', 'http://localhost:4321']
}))
app.use(limiter);

app.get("/helloworld", (_: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/api/v1/characters", characterGetRoutes);
app.use("/api/v2/characters", characterGetRoutesV2);
app.use("/api/v1/characters", characterUpdateRoutes);
app.use("/api/v1/data/get/", dataRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});