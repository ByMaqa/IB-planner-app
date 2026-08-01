import type { AuthConfig } from "convex/server";

const globalEnv = ((globalThis as any).process?.env ?? {}) as Record<string, string | undefined>;

const issuer = globalEnv.VLY_CONVEX_AUTH_ISSUER ?? 
               globalEnv.CONVEX_SITE_URL ?? 
               "http://localhost:5173";
export default {
  providers: [
    {
      type: "customJwt",
      issuer,
      jwks: `${issuer}/api/web/.well-known/jwks.json`,
      applicationID: "convex",
      algorithm: "RS256",
    },
  ],
} satisfies AuthConfig;
