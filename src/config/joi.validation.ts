import * as Joi from 'joi';
import { superRoles } from 'src/users/interfaces/rolesInterface';

export const JoiValidationSchema = Joi.object({
  MONGO_DB: Joi.string().min(1).required(),
  PORT: Joi.number().default(3000),
  EMAIL: Joi.string().email(),
  ROLE: Joi.string().valid(...Object.values(superRoles)),
  JWT_SECRET: Joi.string().min(1).required(),
});
