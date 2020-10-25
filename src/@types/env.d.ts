declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT: string;

    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_EXPIRES_IN: string;

    TYPEORM_TYPE: string;
    TYPEORM_HOST: string;
    TYPEORM_PORT: string;
    TYPEORM_USERNAME: string;
    TYPEORM_PASSWORD: string;
    TYPEORM_DATABASE: string;
    TYPEORM_SYNCHRONIZE: string;
    TYPEORM_LOGGING: string;
    TYPEORM_DROPSCHEMA: string;
    TYPEORM_ENTITIES: string;
    TYPEORM_MIGRATIONS: string;
    TYPEORM_SUBSCRIBERS: string;

    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_DB: string;
    REDIS_PASSWORD: string;

    SMTP_SERVICE: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_SECURE: string;
    SMTP_USER: string;
    SMTP_PASSWORD: string;

    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    AWS_S3_BUCKET_NAME: string;
  }
}
