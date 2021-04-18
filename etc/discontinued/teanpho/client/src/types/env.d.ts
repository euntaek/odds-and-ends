declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    NEXT_PUBLIC_API_ENDPOINT: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
    REDIS_DB: string;
    SESSION_SECRET: string;
  }
}
