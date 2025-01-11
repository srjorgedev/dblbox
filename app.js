import express from "express";
import characterRoutes from "./src/routes/character.routes.js";
import rateLimit from "express-rate-limit";

const app = express();
// const PORT = 2323;

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 10,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

app.get("/helloworld", (req, res) => {
    res.send("Hello World");
});

app.use("/api/v1/characters", characterRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});