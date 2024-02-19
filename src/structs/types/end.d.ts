declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_PORT: string;
    SECRET_KEY: string;
    DBX_TO_CLIENT_KEY: string;
    DBX_TO_CLIENT_SECRET: string;
    DBX_TO_REFRESH_TOKEN: string;
    THUMBNAILS_URL: string;
  }
}
