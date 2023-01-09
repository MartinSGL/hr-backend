import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ContingencyModule } from './contingency/contingency.module';

@Module({
  imports: [
    //allow to read enviroment variables from .env file
    ConfigModule.forRoot(),
    //conection to mongo db
    MongooseModule.forRoot(process.env.MONGO_DB),
    ContingencyModule,
  ],
})
export class AppModule {}
