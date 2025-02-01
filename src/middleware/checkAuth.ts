import { Request, Response, NextFunction } from "express";
import { Supabase } from "../database/supabase";

export async function checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: 'unauthorized',
                message: 'Missing authentication token',
            });
        }

        const { data, error } = await Supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                error: 'unauthorized',
                message: 'Invalid or expired token',
            });
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            error: 'internal_error',
            message: 'An error occurred during authentication',
        });
    }
}