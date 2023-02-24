import * as Joi from 'joi';
//validations for env variables
// TODO:check which default value env variables will take if they are not specified
// these values or app.config values
export const JoiValidationSchema = Joi.object({
  MONGO_DB: Joi.string().min(1).required(),
  PORT: Joi.number().default(3000),
  EMAIL: Joi.string().email(),
  JWT_SECRET: Joi.string().min(1).required(),
  SEED_PASSWORD: Joi.string().required(),
});
