import { Injectable } from '@nestjs/common';
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
    //format the number in order to always get 2 digits
    const format_number = new_number > 9 ? new_number : `0${new_number}`;
    //generate the new folio and return it
    return `${type}-${day}${month}${year}-${format_number}`;
  }
}
