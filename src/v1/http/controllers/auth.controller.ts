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

        const expiresAt = Date.now() + 15 * 60 * 1000;
        return res.json({ ok: true, accessToken: result.accessToken, expiresAt });
    }

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken, sessionId } = req.cookies;

            if (!refreshToken || !sessionId) throw new Error("No cookies");

            const result = await this.service.refresh(sessionId, refreshToken);

            this.setCookies(res, result);
            req.userId = result.userId;
            req.userFromJwt = { id: result.userId };

            const expiresAt = Date.now() + 15 * 60 * 1000;
            return res.json({ ok: true, accessToken: result.accessToken, expiresAt });
        } catch (err) {
            console.error(err);
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

        const expiresAt = Date.now() + 15 * 60 * 1000;
        return res.status(201).json({ ok: true, accessToken: result.accessToken, expiresAt });
    }

    private setCookies(res: Response, data: any) {
        const isProd = process.env.NODE_ENV === 'production';
        const sameSite = isProd ? "none" : "lax";

        console.log("Setting cookies for user:", data.userId || "unknown");
        console.log("AccessToken present:", !!data.accessToken);

        const accessTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

        res.cookie("accessToken", data.accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: sameSite,
            path: "/",
            expires: accessTokenExpires
        });

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: sameSite,
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.cookie("sessionId", data.sessionId, {
            httpOnly: true,
            secure: isProd,
            sameSite: sameSite,
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000 
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
            return res.status(401).json({ message: "Unauthorized no user id" });
        }

        const user = await this.service.getUserData(userId);
        return res.json(user);
    }
}