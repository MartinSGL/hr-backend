//configuracion para utilizar las variables de entorno en los servicios
export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGO_DB,
  port: +process.env.PORT,
  //admin user
  email: process.env.EMAIL,
  role: process.env.ROLE || 'assistant',
  //JWT
  jwt: process.env.JWT_SECRET,
});
