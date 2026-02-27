import { Request, Response } from "express";
import { AuthService } from "@/v1/domain/services/auth.service";

export class AuthController {
    private readonly service: AuthService;

    constructor(service: AuthService) {
        this.service = service;
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const redirectUrl = (req.query.redirect as string) || (req.body.redirect as string);

        const result = await this.service.login(email, password);

        this.setCookies(res, result);

        if (redirectUrl) {
            return res.redirect(redirectUrl);
        }

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
        res.clearCookie("accessToken")

        return res.json({ message: "Logged out" });
    }

    async register(req: Request, res: Response) {
        const { email, password, username } = req.body;
        const redirectUrl = (req.query.redirect as string) || (req.body.redirect as string);

        const result = await this.service.register(username, email, password);

        this.setCookies(res, result);

        if (redirectUrl) {
            return res.redirect(redirectUrl);
        }

        return res.status(201).json({ ok: true });
    }

    private setCookies(res: Response, data: any) {
        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "none"
        });

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "none",
        });

        res.cookie("sessionId", data.sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            sameSite: "none",
        });
    }

    async linkGoogle(req: Request, res: Response) {
        const userId = (req as any).userFromJwt?.id || req.user?.id;
        const profile = req.user; 
        const state = req.query.state as string;
        const redirectUrl = state || `${process.env.FRONTEND_URL}/settings`;

        await this.service.linkGoogleAccount(userId, profile);

        return res.redirect(redirectUrl);
    }

    async googleRedirect(req: Request, res: Response) {
        const { accessToken, refreshToken, sessionId } = req.user as any;
        const state = req.query.state as string;
        const redirectUrl = state || `${process.env.FRONTEND_URL}/dashboard`;

        this.setCookies(res, { accessToken, refreshToken, sessionId });

        return res.redirect(redirectUrl);
    }

    async me(req: Request, res: Response) {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await this.service.getUserData(userId);
        return res.json(user);
    }
}