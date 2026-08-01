declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VLY_CONVEX_AUTH_ISSUER?: string;
      CONVEX_SITE_URL?: string;
    }
  }
}

export {};