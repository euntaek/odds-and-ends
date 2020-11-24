import { RouterContext } from '@koa/router';
import Joi, { ObjectSchema, SchemaMap } from 'joi';

const schemaMap = {
  id: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
  postId: Joi.string().uuid().required(),
  commentId: Joi.string().uuid().required(),
  pId: Joi.number(),
  refCommentId: Joi.string().uuid(),
  replyToId: Joi.string().uuid(),
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
};

type ReqData = { [key in keyof typeof schemaMap]?: any };
type GenerateSchemaAndValue = (reqData: ReqData) => [ObjectSchema, ReqData];

export const generateSchemaAndValue: GenerateSchemaAndValue = reqData => {
  const schema: SchemaMap = {};

  for (const key in reqData) {
    schema[key] = schemaMap[key as keyof typeof schemaMap];
  }
  return [Joi.object().keys(schema), reqData];
};

export const validateSchema = (ctx: RouterContext, schema: ObjectSchema, reqData: ReqData): boolean => {
  if (Object.keys(reqData).length === 0) {
    ctx.state.error = 'requestData의 객체가 비여있습니다.';
    return false;
  }

  const validtaion = schema.validate(reqData);
  if (validtaion.error) {
    ctx.state.error = validtaion.error;
    return false;
  }
  return true;
};
