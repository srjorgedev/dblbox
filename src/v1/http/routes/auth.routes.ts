import { Router } from "express";
import { AuthController } from "@/v1/http/controllers/auth.controller";
import passport from "passport";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler";

export function createAuthRoutes(controller: AuthController) {
    const router = Router();

    router.post("/login", asyncHandler((req, res, next) => controller.login(req, res)));
    router.post("/refresh", asyncHandler((req, res, next) => controller.refresh(req, res)));
    router.post("/logout", asyncHandler((req, res, next) => controller.logout(req, res)));
    router.post("/register", asyncHandler((req, res, next) => controller.register(req, res)));

    router.get("/me", authMiddleware, asyncHandler((req, res, next) => controller.me(req, res)));

    router.get(
        "/google",
        (req, res, next) => {
            const redirect = req.query.redirect as string;

            if (redirect) {
                res.cookie("oauth_redirect", redirect, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 5 * 60 * 1000
                });
            }
            
            passport.authenticate("google", {
                scope: ["profile", "email"],
                session: false
            })(req, res, next);
        }
    );

    router.get(
        "/google/callback",
        passport.authenticate("google", {
            session: false
        }),
        asyncHandler(controller.googleRedirect.bind(controller))
    );

    router.get(
        "/google/link",
        authMiddleware,
        (req, res, next) => {
            const redirect = req.query.redirect as string;

            if (redirect) {
                res.cookie("oauth_redirect", redirect, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 5 * 60 * 1000
                });
            }

            passport.authenticate("google", {
                scope: ["profile", "email"],
                session: false
            })(req, res, next);
        }
    );

    router.get(
        "/google/link/callback",
        authMiddleware,
        passport.authenticate("google", { session: false }),
        asyncHandler(controller.linkGoogle.bind(controller))
    );

    return router;
}