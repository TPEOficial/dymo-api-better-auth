import type { BetterAuthPlugin } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import DymoAPI, { NegativePhoneRules, PhoneValidatorRules, DataPhoneValidationAnalysis } from "dymo-api";

interface DymoPhonePluginOptions {
    apiKey: string;
    applyToLogin?: boolean;
    applyToOAuth?: boolean;
    phoneRules?: Partial<PhoneValidatorRules>;
}

export const dymoPhonePlugin = ({ 
    apiKey,
    applyToLogin = false,
    applyToOAuth = true,
    phoneRules
}: DymoPhonePluginOptions) => {
    const defaultRules: PhoneValidatorRules = {
        deny: ["FRAUD", "INVALID"] as NegativePhoneRules[]
    };

    const dymoClient = new DymoAPI({
        apiKey,
        rules: {
            phone: {
                deny: phoneRules?.deny ?? defaultRules.deny
            }
        }
    });

    const activePaths = [
        "/sign-in/phone-number",
        "/phone-number/forget-password",
        "/phone-number/reset-password",
        "/phone-number/send-otp",
        "/phone-number/verify"
    ];
    if (applyToLogin) activePaths.push("/sign-in/email");
    if (applyToOAuth) {
        activePaths.push("/sign-up/oauth");
        activePaths.push("/sign-in/oauth");
    }

    return {
        id: "dymoPhonePlugin",
        hooks: {
            before: [
                {
                    matcher: (context: any) => activePaths.some(path => context.path.startsWith(path)),
                    handler: createAuthMiddleware(async (ctx: any) => {
                        const phoneNumber = ctx.body?.phoneNumber || ctx.body?.profile?.phoneNumber;
                        
                        if (typeof phoneNumber !== "string") throw new APIError("BAD_REQUEST", { message: "Phone number must be a string." });

                        const decision = await dymoClient.isValidPhone(phoneNumber);

                        if (!decision.allow) {
                            throw new APIError("BAD_REQUEST", {
                                message: "Phone number is invalid or blocked.",
                                reasons: decision.reasons
                            });
                        }

                        ctx.body.phoneNumber = decision.phone;
                        ctx.dymoEmail = decision.response as DataPhoneValidationAnalysis;

                        return { context: ctx };
                    })
                }
            ]
        }
    } satisfies BetterAuthPlugin;
};