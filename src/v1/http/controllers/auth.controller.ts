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
            secure: true,
            sameSite: "none",
            path: "/"
        });

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });

        res.cookie("sessionId", data.sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });
    }

    async linkGoogle(req: Request, res: Response) {
        const userId = req.userId!;
        const profile = req.user;

        const redirectUrl = req.cookies.oauth_redirect || `${process.env.FRONTEND_URL}/settings`;
        res.clearCookie("oauth_redirect");

        await this.service.linkGoogleAccount(userId, profile);

        return res.redirect(redirectUrl);
    }

    async googleRedirect(req: Request, res: Response) {
        const profile = req.user;
        const result = await this.service.loginWithGoogle(profile);

        const redirectUrl = req.cookies.oauth_redirect || "/";
        res.clearCookie("oauth_redirect");

        this.setCookies(res, result);

        return res.redirect(redirectUrl);
    }

    async me(req: Request, res: Response) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await this.service.getUserData(userId);
        return res.json(user);
    }
}