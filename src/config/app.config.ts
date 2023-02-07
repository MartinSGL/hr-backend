//configuration to use the env variables in services without using proccess.env file
export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  //server port
  port: +process.env.PORT,
  mongodb: process.env.MONGO_DB,
  //admin user
  email: process.env.EMAIL,
  role: process.env.ROLE || 'assistant',
  //JWT
  jwt: process.env.JWT_SECRET,
  //seed password
  seed_password: process.env.SEED_PASSWORD,
});
