/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY?: string;
    GOOGLE_CLIENT_ID?: string;
    [key: string]: string | undefined;
  }
}
