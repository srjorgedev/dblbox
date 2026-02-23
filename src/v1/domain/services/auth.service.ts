import { SessionRepo, AccountRepo, UserRepo } from "@/v1/domain/repositories";
import { hashPassword, comparePassword } from "@/utils/hash.util";
import { generateAccessToken } from "@/utils/jwt.util";

import crypto from "crypto";
import { now } from "@/utils/date.util";

export class AuthService {
    private readonly userRepo: UserRepo;
    private readonly accountRepo: AccountRepo;
    private readonly sessionRepo: SessionRepo;

    constructor(userRepo: UserRepo, accountRepo: AccountRepo, sessionRepo: SessionRepo) {
        this.accountRepo = accountRepo;
        this.sessionRepo = sessionRepo;
        this.userRepo = userRepo;
    }

    async login(email: string, password: string) {

        const account = await this.accountRepo.findByEmail(email);
        if (!account) throw new Error("Invalid credentials");

        const valid = await comparePassword(password, account.password_hash!);
        if (!valid) throw new Error("Invalid credentials");

        return this.createSession(account.user_id);
    }

    async refresh(sessionId: string, refreshToken: string) {
        const session = await this.sessionRepo.findById(sessionId);

        if (!session) throw new Error("Invalid session");

        if (Number(session.expires_at) < now()) {
            await this.sessionRepo.delete(sessionId);
            throw new Error("Session expired");
        }

        const valid = await comparePassword(
            refreshToken,
            String(session.refresh_token_hash)
        );

        if (!valid) throw new Error("Invalid refresh token");

        const accessToken = generateAccessToken({
            sub: session.user_id
        });

        return { accessToken };
    }

    async register(username: string, email: string, password: string) {
        const existing = await this.accountRepo.findByEmail(email);

        if (existing) {
            throw new Error("Email already registered");
        }

        const userId = crypto.randomUUID();

        await this.userRepo.create({
            id: userId,
            username,
            avatar: "null"
        });

        const passwordHash = await hashPassword(password);

        await this.accountRepo.create({
            provider: "credentials",
            provider_account_id: email,
            user_id: userId,
            email,
            password_hash: passwordHash
        });

        const refreshToken = crypto.randomBytes(64).toString("hex");
        const refreshHash = await hashPassword(refreshToken);
        const sessionId = crypto.randomUUID();

        await this.sessionRepo.create({
            id: sessionId,
            user_id: userId,
            refresh_token_hash: refreshHash,
            created_at: now(),
            expires_at: now() + 60 * 60 * 24 * 7
        });

        const accessToken = generateAccessToken({
            sub: userId,
            role: 1
        });

        return { accessToken, refreshToken, sessionId };
    }

    async logout(sessionId: string) {
        await this.sessionRepo.delete(sessionId);
    }

    async loginWithGoogle(profile: any) {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const username = profile.displayName;
        const avatar = profile.photos?.[0]?.value;

        if (!email) throw new Error("No email");

        const existingGoogle = await this.accountRepo.findByProvider(
            "google",
            googleId
        );

        let userId: string;

        if (existingGoogle) {
            userId = existingGoogle.user_id;
        } else {

            const existingLocal = await this.accountRepo.findByEmail(email);

            if (existingLocal) {

                userId = existingLocal.user_id;

                await this.accountRepo.create({
                    provider: "google",
                    provider_account_id: googleId,
                    user_id: userId,
                    email,
                    password_hash: null
                });

            } else {
                userId = crypto.randomUUID();

                await this.userRepo.create({
                    id: userId,
                    username,
                    avatar
                });

                await this.accountRepo.create({
                    provider: "google",
                    provider_account_id: googleId,
                    user_id: userId,
                    email,
                    password_hash: null
                });
            }
        }

        return this.createSession(userId);
    }

    private async createSession(userId: string) {
        const sessionId = crypto.randomUUID();
        const refreshToken = crypto.randomBytes(64).toString("hex");

        const refreshHash = await hashPassword(refreshToken);

        const now = Math.floor(Date.now() / 1000);

        await this.sessionRepo.create({
            id: sessionId,
            user_id: userId,
            refresh_token_hash: refreshHash,
            created_at: now,
            expires_at: now + 60 * 60 * 24 * 7
        });

        const accessToken = generateAccessToken({
            sub: userId
        });

        return {
            accessToken,
            refreshToken,
            sessionId
        };
    }

    async linkGoogleAccount(userId: string, profile: any) {

        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;

        const existing = await this.accountRepo.findByProvider(
            "google",
            googleId
        );

        if (existing) {
            throw new Error("Google already linked");
        }

        await this.accountRepo.create({
            provider: "google",
            provider_account_id: googleId,
            user_id: userId,
            email,
            password_hash: null
        });
    }
}