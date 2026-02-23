import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateAccessToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "15m"
    });
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}