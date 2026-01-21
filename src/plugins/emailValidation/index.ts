import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import DymoAPI, { NegativeEmailRules, EmailValidatorRules, DataEmailValidationAnalysis, ResilienceConfig } from "dymo-api";

interface DymoEmailPluginOptions {
    apiKey: string;
    applyToLogin?: boolean;
    applyToOAuth?: boolean;
    emailRules?: Partial<EmailValidatorRules>;
    normalize?: boolean;
    resilience?: ResilienceConfig;
}

export const dymoEmailPlugin = ({
    apiKey,
    applyToLogin = false,
    applyToOAuth = true,
    emailRules,
    normalize = true,
    resilience
}: DymoEmailPluginOptions) => {
    const defaultRules: EmailValidatorRules = {
        deny: ["FRAUD", "INVALID", "NO_MX_RECORDS", "NO_REPLY_EMAIL"] as NegativeEmailRules[]
    };

    const dymoClient = new DymoAPI({
        apiKey,
        rules: {
            email: {
                deny: emailRules?.deny ?? defaultRules.deny
            }
        },
        resilience
    });

    const activePaths = [
        "/sign-up/email",
        "/email-otp/verify-email",
        "/sign-in/email-otp",
        "/sign-in/magic-link",
        "/forget-password/email-otp",
        "/email-otp/reset-password",
        "/email-otp/create-verification-otp",
        "/email-otp/get-verification-otp",
        "/email-otp/send-verification-otp",
        "/forget-password",
        "/send-verification-email",
        "/change-email"
    ];
    if (applyToLogin) activePaths.push("/sign-in/email");
    if (applyToOAuth) {
        activePaths.push("/sign-up/oauth");
        activePaths.push("/sign-in/oauth");
    }

    return {
        id: "dymoEmailPlugin",
        hooks: {
            before: [
                {
                    matcher: (context: any) => activePaths.some(path => context.path.startsWith(path)),
                    handler: createAuthMiddleware(async (ctx: any) => {
                        const email = ctx.body?.email || ctx.body?.profile?.email;
                        
                        if (typeof email !== "string") throw new APIError("BAD_REQUEST", { message: "Email must be a string." });

                        const decision = await dymoClient.isValidEmail(email);

                        if (!decision.allow) {
                            throw new APIError("BAD_REQUEST", {
                                message: "Email is invalid or blocked.",
                                reasons: decision.reasons
                            });
                        }

                        if (normalize) ctx.body.email = decision.email;
                        ctx.dymoEmail = decision.response as DataEmailValidationAnalysis;

                        return { context: ctx };
                    })
                }
            ]
        }
    } satisfies BetterAuthPlugin;
};