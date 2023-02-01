import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { ContingenciesModule } from './contingencies/contingencies.module';
import { HolidaysModule } from './holidays/holidays.module';
import { VacationsModule } from './vacations/vacations.module';
import { SeedModule } from './seeds/seeds.module';
import { UsersModule } from './users/users.module';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { SenioritiesModule } from './seniorities/seniorities.module';

@Module({
  imports: [
    //allow to read enviroment variables from .env file
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    //conection to mongo db
    MongooseModule.forRoot(process.env.MONGO_DB),
    // Application Mudules
    ContingenciesModule,
    HolidaysModule,
    VacationsModule,
    SeedModule,
    UsersModule,
    SenioritiesModule,
  ],
})
export class AppModule {}
