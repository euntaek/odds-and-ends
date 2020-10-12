declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production'
    PORT: string
    SECRET_KEY: string
    TYPEORM_TYPE: string
    TYPEORM_HOST: string
    TYPEORM_PORT: string
    TYPEORM_USERNAME: string
    TYPEORM_PASSWORD: string
    TYPEORM_DATABASE: string
    TYPEORM_SYNCHRONIZE: string
    TYPEORM_LOGGING: string
    TYPEORM_DROPSCHEMA: string
    TYPEORM_ENTITIES: string
    TYPEORM_MIGRATIONS: string
    TYPEORM_SUBSCRIBERS: string

    SMTPT_SERVICE: string
    SMTPT_HOST: string
    SMTPT_PORT: string
    SMTPT_SECURE: string
    SMTPT_USER: string
    SMTPT_PASSWORD: string
  }
}
