<div align="center">
  <h1>Dymo API for Better-Auth</h1>
  <h3>Official Dymo API Library for Better-Auth</h3>
  <img src="https://img.shields.io/badge/TypeScript-purple?style=for-the-badge&logo=typescript&logoColor=white"/> 
  <a href="https://github.com/TPEOficial"> <img alt="GitHub" src="https://img.shields.io/badge/GitHub-purple?style=for-the-badge&logo=github&logoColor=white"/></a>
  <a href="https://ko-fi.com/fjrg2007"> <img alt="Kofi" src="https://img.shields.io/badge/Ko--fi-purple?style=for-the-badge&logo=ko-fi&logoColor=white"></a>
  <br />
  <br />
  <a href="https://docs.tpeoficial.com/docs/dymo-api/integrations/better-auth/email-validation?ch-pg=gh-dmapi-better-auth-rd-step">Quickstart</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tpe.li/dsc">Discord</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://docs.tpeoficial.com/docs/dymo-api/integrations/better-auth/getting-started?ch-pg=gh-dmapi-better-auth-rd-step">All Features</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://docs.tpeoficial.com/docs/dymo-api/getting-started/authentication?ch-pg=gh-dmapi-better-auth-rd-step">Node SDK</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://docs.tpeoficial.com/docs/dymo-api/getting-started/faq?ch-pg=gh-dmapi-better-auth-rd-step">FAQ</a>
  <br />
  <hr />
</div>

You can see the library documentation by clicking [here](https://docs.tpeoficial.com/docs/dymo-api/getting-started/libraries?ch-pg=r-dm-better-auth).

 - ✅ World's largest fraud validation database | `fakeuser@temp.com` -> **Blocked**.
 - ✅ Fraud validation for personal emails and OAuth (the only one on the market today) | `fakeuser@gmail.com` -> **Blocked**.
 - ✅ Multi-data validation at no additional cost | Validate email addresses, phone numbers, and more at no additional cost, all in one place.
 - ✅ Data normalization | `fo.o+tem.p@gmail.com` -> `foo@gmail.com` (can be disabled with `normalize: false`).

#### Installation

Use one of the following commands to install **Dymo API** in your `TS`/`JS` project.

```bash
npm cache clean --force && npm i @dymo-api/better-auth

# or

pnpm cache clean --force && pnpm i @dymo-api/better-auth

# or

yarn cache clean --force && yarn add @dymo-api/better-auth
```

#### Authenticating ourselves on the client with the API Key

[Get my free API Key](https://tpe.li/new-api-key?ch-pg=gh-dmapi-better-auth-rd-step)

#### Email Validation

```ts
export const auth = betterAuth({
    plugins: [
        dymoEmailPlugin({
            apiKey: "YOUR_API_KEY_HERE",
            emailRules: {
                deny: ["FRAUD", "INVALID", "NO_REPLY_EMAIL"]
            }
            // normalize: true (default) - Set to false to disable email normalization
        })
    ]
});
```

#### IP Validation (Experimental)

```ts
export const auth = betterAuth({
    plugins: [
        dymoIPPlugin({
            apiKey: "YOUR_API_KEY_HERE",
            ipRules: {
                deny: ["FRAUD", "INVALID", "TOR_NETWORK"]
            }
            // normalize: true (default) - Set to false to disable IP normalization
        })
    ]
});
```

#### Phone Validation

```ts
export const auth = betterAuth({
    plugins: [
        dymoPhonePlugin({
            apiKey: "YOUR_API_KEY_HERE",
            phoneRules: {
                deny: ["FRAUD", "INVALID"]
            }
            // normalize: true (default) - Set to false to disable phone normalization
        })
    ]
});
```

More types of validations coming soon to keep you protected.

## Frequently Asked Questions

<details>
  <summary>Email mismatch error when logging in with Google and others</summary>
  
  **Dymo API** normalizes the email by default, removing, for example, the `.` and `+` from the email based on the specific provider, which means that if you are not also normalizing the email in the login via OAuth, you will get a mismatch error.

  To do this, you have two options: the first and correct one would be to also normalize the login email, and the second would be to disable normalization using `normalize: false`.
</details>