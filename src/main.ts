import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function main() {
  //cors true allows to make request from the front-end system
  const app = await NestFactory.create(AppModule, { cors: true });
  // global prefix for all endpoints
  app.setGlobalPrefix('api/v1');
  // validate all pipes
  //in this case is used to return a response when Dto validation fail
  app.useGlobalPipes(
    new ValidationPipe({
      //clear list of non required values in dto
      whitelist: true,
      //validate non required values in dto
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT);
}
main();
