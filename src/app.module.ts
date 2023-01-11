import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ContingenciesModule } from './contingencies/contingencies.module';
import { HolidaysModule } from './holidays/holidays.module';
import { VacationsModule } from './vacations/vacations.module';

@Module({
  imports: [
    //allow to read enviroment variables from .env file
    ConfigModule.forRoot(),
    //conection to mongo db
    MongooseModule.forRoot(process.env.MONGO_DB),
    // Application Mudules
    ContingenciesModule,
    HolidaysModule,
    VacationsModule,
  ],
})
export class AppModule {}
