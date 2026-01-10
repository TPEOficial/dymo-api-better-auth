import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import DymoAPI, { NegativeIPRules, IPValidatorRules, DataIPValidationAnalysis } from "dymo-api";

interface dymoIPPluginOptions {
    apiKey: string;
    applyToLogin?: boolean;
    applyToOAuth?: boolean;
    ipRules?: Partial<IPValidatorRules>;
    normalize?: boolean;
}

const ipHeaders = ["x-forwarded-for", "cf-connecting-ip", "x-vercel-forwarded-for", "x-real-ip"];

export const dymoIPPlugin = ({
    apiKey,
    applyToLogin = false,
    applyToOAuth = true,
    ipRules,
    normalize = true
}: dymoIPPluginOptions) => {
    const defaultRules: IPValidatorRules = {
        deny: ["FRAUD", "INVALID", "TOR_NETWORK"] as NegativeIPRules[]
    };

    const dymoClient = new DymoAPI({
        apiKey,
        rules: {
            ip: {
                deny: ipRules?.deny ?? defaultRules.deny
            }
        }
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
        id: "dymoIPPlugin",
        hooks: {
            before: [
                {
                    matcher: (context: any) => activePaths.some(path => context.path.startsWith(path)),
                    handler: createAuthMiddleware(async (ctx: any) => {
                        let ip: string | null = null;
                        for (const header of ipHeaders) {
                            const value = ctx.request.headers.get(header);
                            if (value) {
                                ip = value.split(",")[0].trim();
                                break;
                            }
                        }
                        
                        if (typeof ip !== "string") throw new APIError("BAD_REQUEST", { message: "IP must be a string." });

                        const decision = await dymoClient.isValidIP(ip);

                        if (!decision.allow) {
                            throw new APIError("BAD_REQUEST", {
                                message: "IP is invalid or blocked.",
                                reasons: decision.reasons
                            });
                        }

                        if (normalize) {
                            ctx.body.ip = decision.ip;
                            ctx.request.headers.set("x-dymo-client-ip", decision.ip);
                        }
                        ctx.dymoIP = decision.response as DataIPValidationAnalysis;
                        
                        return { context: ctx };
                    })
                }
            ]
        }
    } satisfies BetterAuthPlugin;
};