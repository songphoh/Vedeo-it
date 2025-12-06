// Fix for missing vite/client types
declare const process: {
  env: {
    [key: string]: string | undefined;
    API_KEY?: string;
    GOOGLE_CLIENT_ID?: string;
  }
};
