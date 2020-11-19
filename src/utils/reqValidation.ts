import { RouterContext } from '@koa/router';
import Joi, { ObjectSchema, SchemaMap } from 'joi';

const schemaMap = {
  id: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(24).required(),
  username: Joi.string()
    .pattern(/^[a-z0-9-_]+$/)
    .min(3)
    .max(16)
    .required(),
  displayName: Joi.string()
    .pattern(/^[ㄱ-ㅎ가-힣a-zA-Z0-9-_]+$/)
    .min(2)
    .max(16)
    .required(),
  about: Joi.string().max(160),
  thumbnail: Joi.string().max(255),
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required(),
  emailAuthToken: Joi.string().hex().length(64),
  content: Joi.string().max(160).required(),
  tags: Joi.array().items(Joi.string()).required(),
  images: Joi.array().items(Joi.string()),
  tag: Joi.string().max(255),
  'post-id': Joi.string().uuid().required(),
  'last-id': Joi.string().uuid().required(),
};

type GenerateSchema = (schemaKeys: { [key in keyof typeof schemaMap]?: any }) => ObjectSchema;

export const generateSchema: GenerateSchema = schemaKeys => {
  const schema: SchemaMap = {};

  for (const key in schemaKeys) {
    schema[key] = schemaMap[key as keyof typeof schemaMap];
  }
  return Joi.object().keys(schema);
};

export const validateSchema = (
  ctx: RouterContext,
  schema: ObjectSchema,
  reqPropertyName: 'body' | 'query' | 'params' = 'body',
): boolean => {
  const requestData = reqPropertyName === 'params' ? ctx.params : ctx.request[reqPropertyName];
  if (Object.keys(requestData).length === 0) {
    ctx.state.error = 'requestData의 객체가 비여있습니다.';
    return false;
  }

  const validtaion = schema.validate(requestData);
  if (validtaion.error) {
    ctx.state.error = validtaion.error;
    return false;
  }
  return true;
};
