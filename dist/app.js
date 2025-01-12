"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const character_routes_js_1 = __importDefault(require("./src/routes/character.routes.js"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const limiter = (0, express_rate_limit_1.default)({
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
app.use("/api/v1/characters", character_routes_js_1.default);
app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});
