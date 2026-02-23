import jwt from "jsonwebtoken";

export function generateAccessToken(payload: object) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m"
    });
}

export function verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET) as any;
}