declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_DEVELOPMENT_URL: string;
  }
}
