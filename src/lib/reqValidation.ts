import { RouterContext } from '@koa/router';
import Joi, { ObjectSchema, SchemaMap } from 'joi';

interface RequestData {
  email: string;
  password: string;
  username: string;
  displayName: string;
  thumbnail: string;
  accessToken: string;
  refreshToken: string;
  emailAuthToken: string;
  body: string;
  tags: string[];
}

const schemaMap = {
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(24).required(),
  displayName: Joi.string()
    .pattern(/^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]+$/)
    .min(2)
    .max(16)
    .required(),
  username: Joi.string()
    .pattern(/^[a-z0-9-_]+$/)
    .min(3)
    .max(16)
    .required(),
  thumbnail: Joi.string().max(255),
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
  emailAuthToken: Joi.string().required(),
  body: Joi.string().max(160).required(),
  tags: Joi.array().items(Joi.string()).required(),
};

type GenerateSchema = (keys: Partial<RequestData>) => ObjectSchema;

export const generateSchema: GenerateSchema = keys => {
  const schema: SchemaMap = {};
  // keys.forEach(key => {
  //   schema[key] = schemaMap[key];
  // });
  for (const key in keys) {
    schema[key] = schemaMap[key as keyof RequestData];
  }
  return Joi.object().keys(schema);
};

export const validateSchema = (
  ctx: RouterContext,
  schema: ObjectSchema,
  reqPropertyName: 'body' | 'query' | 'params',
): boolean => {
  const validtaion = schema.validate(
    reqPropertyName === 'params' ? ctx.params : ctx.request[reqPropertyName],
  );
  if (validtaion.error) {
    ctx.state.error = validtaion.error;
    return false;
  }
  return true;
};
