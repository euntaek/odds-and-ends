export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_SERVER = typeof window === 'undefined';
export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
