import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AuthService } from "@/v1/domain/services/auth.service";

export function configureGoogle(authService: AuthService) {

    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const result = await authService.loginWithGoogle(profile);
                done(null, result);
            } catch (err) {
                done(err as Error);
            }
        }
    ));
}