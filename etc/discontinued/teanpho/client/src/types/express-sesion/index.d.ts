export declare module 'express-session' {
  interface SessionData {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
}
