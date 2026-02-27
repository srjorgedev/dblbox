import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt.util";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        token = req.cookies.accessToken;
    }
    
    console.log({token})

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const payload = verifyToken(token);

        console.log(payload)

        req.userId = payload.sub;
        req.userFromJwt = {
            id: payload.sub,
        };

        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}