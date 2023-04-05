//configuration to use the env variables in services without using proccess.env file
export const EnvConfiguration = () => ({
  enviroment: process.env.NODE_ENV || 'dev',
  //server port
  port: +process.env.PORT,
  mongodb: process.env.MONGO_DB,
  //admin user
  email: process.env.EMAIL,
  //JWT
  jwt: process.env.JWT_SECRET,
  //seed password
  seed_password: process.env.SEED_PASSWORD,
  //cloudinary
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  //nodemailer
  nodemailer_service: process.env.NODEMAILER_SERVICE,
  nodemailer_email: process.env.NODEMAILER_EMAIL,
  nodemailer_password: process.env.NODEMAILER_PASSWORD,
  //URL_ENCRYPTED
  jwt_url: process.env.JWT_URL,
  request_preauthorization_url_base:
    process.env.REQUEST_PREAUTHORIZATION_URL_BASE,
});
