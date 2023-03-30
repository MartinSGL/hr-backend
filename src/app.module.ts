import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ContingenciesModule } from './contingencies/contingencies.module';
import { HolidaysModule } from './holidays/holidays.module';
import { VacationsModule } from './vacations/vacations.module';
import { SeedsModule } from './seeds/seeds.module';
import { UsersModule } from './users/users.module';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { SenioritiesModule } from './seniorities/seniorities.module';
import { FilesModule } from './files/files.module';
import { PreauthorizationsModule } from './preauthorizations/preauthorizations.module';

@Module({
  imports: [
    //allow to read enviroment variables from .env file
    //without using process.env way
    ConfigModule.forRoot({
      //make env variables avaliable in the system check (EnvConfig file)
      load: [EnvConfiguration],
      //validate using joi library env variables (if required variable is missing system fails)
      validationSchema: JoiValidationSchema,
    }),
    //conection to mongo db
    MongooseModule.forRoot(process.env.MONGO_DB),
    // Application Modules
    ContingenciesModule,
    HolidaysModule,
    VacationsModule,
    SeedsModule,
    UsersModule,
    SenioritiesModule,
    FilesModule,
    PreauthorizationsModule,
  ],
})
export class AppModule {}
