import { Request, Response, NextFunction } from "express";
import { hasSessionService } from "../services/auth.services";

export async function checkAuth(_: Request, res: Response, next: NextFunction) {
    try {
        const session = await hasSessionService();

        if (!session) {
            return res.status(401).json({
                error: 'unauthorized',
                message: 'Your session has expired, or you may not logged in'
            });
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            error: 'internal_error',
            message: 'An error occurred during authentication'
        });
    }
}