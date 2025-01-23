import { logInService } from "../services/auth.services";
import { Request, Response } from "express";

export async function logInController(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const { session, user } = await logInService(email, password);

        const filteredUser = {
            id: user?.id,
            email: user?.email,
        };
        res.status(200).json({
            message: "Login successful",
            user: filteredUser,
            token: session?.access_token,
        });
    } catch (error) {
        console.error("Error during login:", (error as Error).message);
        res.status(401).json({
            message: "Authentication failed",
            error: (error as Error).message,
        });
    }
}
