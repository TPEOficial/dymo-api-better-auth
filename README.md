# Official Dymo API Library for Better Auth.

You can see the library documentation by clicking [here](https://docs.tpeoficial.com/docs/dymo-api/getting-started/libraries?ch-pg=r-dm-node).

#### Installation

Use one of the following commands to install **Dymo API** in your `TS`/`JS` project.

```bash
npm i @dymo-api/better-auth

# or

pnpm i @dymo-api/better-auth

# or

yarn add @dymo-api/better-auth
```

#### Authenticating ourselves on the client with the API Key

[Get my free API Key](https://tpe.li/new-api-key?ch-pg=gh-dmapi-node-rd-step)

#### Email Validation

```ts
export const auth = betterAuth({
    plugins: [
	    dymoEmailPlugin({ 
            apiKey: "YOUR_API_KEY_HERE",
            emailRules: {
                deny: ["FRAUD", "INVALID", "NO_REPLY_EMAIL"]
			}
        })
    ]
});
```

More types of validations coming soon to keep you protected.