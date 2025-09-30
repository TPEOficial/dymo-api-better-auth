import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import DymoAPI, { NegativeEmailRules, EmailValidatorRules } from "dymo-api";

interface DymoEmailPluginOptions {
    apiKey: string;
    emailRules?: Partial<EmailValidatorRules>;
}

export const dymoEmailPlugin = ({ apiKey, emailRules }: DymoEmailPluginOptions) => {
    const defaultRules: EmailValidatorRules = {
        deny: ["FRAUD", "INVALID", "NO_MX_RECORDS", "NO_REPLY_EMAIL"] as NegativeEmailRules[]
    };

    const dymoClient = new DymoAPI({
        apiKey,
        rules: {
            email: {
                deny: emailRules?.deny ?? defaultRules.deny
            }
        }
    });

    return {
        id: "dymoEmailPlugin",
        hooks: {
            before: [
                {
                    matcher: (context: any) => context.path.startsWith("/sign-up/email"),
                    handler: createAuthMiddleware(async (ctx: any) => {
                        const { email } = ctx.body;

                        if (typeof email !== "string") throw new APIError("BAD_REQUEST", { message: "Email must be a string." });

                        const decision = await dymoClient.isValidEmail(email);

                        if (!decision.allow) {
                            throw new APIError("BAD_REQUEST", {
                                message: "Email is invalid or blocked.",
                                reasons: decision.reasons
                            });
                        }

                        return { context: ctx };
                    })
                }
            ]
        }
    } satisfies BetterAuthPlugin;
};