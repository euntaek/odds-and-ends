declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    MONGODB_URI: string;
    PORT: string;
    SWAGGER_USER: string;
    SWAGGER_PASSWORD: string;
    JWT_SECRET: string;
  }
}
