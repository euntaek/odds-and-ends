declare module 'joi-objectid' {
  import { Root, StringSchema } from 'joi';

  type JoiStringSchema = () => StringSchema;

  export default function (Joi: Root, message?: string): JoiStringSchema;
}
