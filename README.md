<div align="center">
  <h1>Dymo API for Better-Auth</h1>
  <h3>Official Dymo API Library for Better-Auth</h3>
  <img src="https://img.shields.io/badge/TypeScript-purple?style=for-the-badge&logo=typescript&logoColor=white"/> 
  <a href="https://github.com/FJRG2007"> <img alt="GitHub" src="https://img.shields.io/badge/GitHub-purple?style=for-the-badge&logo=github&logoColor=white"/></a>
  <a href="https://ko-fi.com/fjrg2007"> <img alt="Kofi" src="https://img.shields.io/badge/Ko--fi-purple?style=for-the-badge&logo=ko-fi&logoColor=white"></a>
  <br />
  <br />
  <a href="https://docs.tpeoficial.com/docs/dymo-api/integrations/better-auth/email-validation?ch-pg=gh-dmapi-better-auth-rd-step">Quickstart</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://tpe.li/dsc">Discord</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://docs.tpeoficial.com/docs/dymo-api/integrations/better-auth/getting-started?ch-pg=gh-dmapi-better-auth-rd-step">All Features</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://docs.tpeoficial.com/docs/dymo-api/getting-started/faq?ch-pg=gh-dmapi-better-auth-rd-step">FAQ</a>
  <br />
  <hr />
</div>

You can see the library documentation by clicking [here](https://docs.tpeoficial.com/docs/dymo-api/getting-started/libraries?ch-pg=r-dm-better-auth).

 - ✅ World's largest fraud validation database | `fakeuser@temp.com` -> **Blocked**.
 - ✅ Fraud validation for personal emails and OAuth (the only one on the market today) | `fakeuser@gmail.com` -> **Blocked**.
 - ✅ Multi-data validation at no additional cost | Validate email addresses, phone numbers, and more at no additional cost, all in one place.
 - ✅ Data normalization | `fo.o+tem.p@gmail.com` -> `foo@gmail.com`.

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
        })
    ]
});
```

More types of validations coming soon to keep you protected.