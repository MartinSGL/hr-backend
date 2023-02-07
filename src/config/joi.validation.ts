import * as Joi from 'joi';
import { superRoles } from 'src/users/interfaces/rolesInterface';
//validations for env variables
// TODO:check which default value env variables will take if they are not specified
// these values or app.config values
export const JoiValidationSchema = Joi.object({
  MONGO_DB: Joi.string().min(1).required(),
  PORT: Joi.number().default(3000),
  EMAIL: Joi.string().email(),
  ROLE: Joi.string().valid(superRoles.admin), //check that role is correct and other validations
  JWT_SECRET: Joi.string().min(1).required(),
  SEED_PASSWORD: Joi.string().required(),
});
