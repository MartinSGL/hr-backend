import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { Transactions } from './interfaces/transactions.interface';

@Injectable()
export class CommonService {
  async generateFolio(
    model: Model<any>,
    type: Transactions[keyof Transactions],
  ) {
    //search last today's documents
    //TODO: get rid of the hide dependency 'DateTime' from luxon
    const today = DateTime.now().setLocale('zh').toLocaleString();
    const tomorrow = DateTime.now()
      .plus({ days: 1 })
      .setLocale('zh')
      .toLocaleString();

    //get today last documents
    const last_document = await model
      .findOne({
        createdAt: {
          $gte: today,
          $lte: tomorrow,
        },
      })
      .sort({ createdAt: -1 });

    //get params of date for folio
    const { year, month, day } = DateTime.now();
    //if there is no documents start with 01
    if (!last_document) return `${type}-${year}${month}${day}-01`;
    //get the number from folio - 01
    const last_number = last_document.folio.split('-')[2];
    //turn the string into number and add 1
    const new_number = +last_number + 1;
    //format numbers in order to always get 2 digits
    const format_year = year.toString().substring(2, 4);
    const format_number = new_number > 9 ? new_number : `0${new_number}`;
    const format_month = month > 9 ? month : `0${month}`;
    const format_day = day > 9 ? day : `0${day}`;
    //generate the new folio and return it VAC-230123-01
    //VAC = tipe of request
    //230123 = 2023 January 23
    //01 first request of the day
    return `${type}-${format_year}${format_month}${format_day}-${format_number}`;
  }

  handleError(error: any) {
    console.log(error);
    // error for violation to unique rule in entity
    if (error.code === 11000) {
      throw new BadRequestException(
        `Duplicate ${Object.keys(error.keyValue)[0]} : ${
          error.keyValue[Object.keys(error.keyValue)[0]]
        }`,
      );
    }
    // error for any BadRequestException(status 400)
    if (error.response.statusCode === 400) {
      throw new BadRequestException(error.message);
    }

    // unknow error
    throw new InternalServerErrorException('Server Error, check logs');
  }
}
