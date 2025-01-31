import { Response, Request, NextFunction } from "express";
import { Supabase } from "../database/supabase";

interface User {
    id: string;
    email?: string;
}

declare module "express-serve-static-core" {
    interface Request {
        user?: User;
    }
}

export async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'unauthorized',
                message: 'Missing or invalid authorization header'
            });
        }

        const token = authHeader.split(' ')[1];
        const { data: { user }, error } = await Supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                error: 'unauthorized',
                message: 'Invalid or expired token'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            error: 'internal_error',
            message: 'An error occurred during authentication'
        });
    }
}