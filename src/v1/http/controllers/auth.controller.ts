import { Request, Response } from "express";
import { AuthService } from "@/v1/domain/services/auth.service";

export class AuthController {
    private readonly service: AuthService;

    constructor(service: AuthService) {
        this.service = service;
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const result = await this.service.login(email, password);

        this.setCookies(res, result);

        return res.json({ ok: true });
    }

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken, sessionId } = req.cookies;

            const { accessToken } =
                await this.service.refresh(sessionId, refreshToken);

            return res.json({ accessToken });

        } catch {
            return res.status(401).json({ message: "Invalid session" });
        }
    }

    async logout(req: Request, res: Response) {
        const { sessionId } = req.cookies;

        await this.service.logout(sessionId);

        res.clearCookie("refreshToken");
        res.clearCookie("sessionId");

        return res.json({ message: "Logged out" });
    }

    async register(req: Request, res: Response) {
        const { email, password, username } = req.body;

        const result = await this.service.register(username, email, password);

        this.setCookies(res, result);

        return res.status(201).json({ ok: true });
    }

    private setCookies(res: Response, data: any) {
        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/api/v1/auth/refresh"
        });

        res.cookie("sessionId", data.sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/api/v1/auth/refresh"
        });
    }

    async linkGoogle(req: Request, res: Response) {

        const userId = (req as any).userFromJwt.id;
        const profile = req.user; 

        await this.service.linkGoogleAccount(userId, profile);

        return res.redirect(`${process.env.FRONTEND_URL}/settings`);
    }

    async googleRedirect(req: Request, res: Response) {
        const { accessToken, refreshToken, sessionId } = req.user as any;

        this.setCookies(res, { accessToken, refreshToken, sessionId });

        return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
}