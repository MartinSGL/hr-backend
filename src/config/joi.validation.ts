import * as Joi from 'joi';
import { roles } from 'src/users/users.interface';

export const JoiValidationSchema = Joi.object({
  MONGO_DB: Joi.required(),
  PORT: Joi.number().default(3000),
  EMAIL: Joi.string().email(),
  ROLE: Joi.string().valid(...Object.values(roles)),
});
