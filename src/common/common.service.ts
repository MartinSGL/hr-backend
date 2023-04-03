import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { Model } from 'mongoose';
import { PreauthorizationsService } from 'src/preauthorizations/preauthorizations.service';
import { TypeRequest } from './interfaces/type-request-folio.interface';

@Injectable()
export class CommonService {
  //functon to generate folio according to the type of request
  async generateFolio(model: Model<any>, type: TypeRequest[keyof TypeRequest]) {
    //search last today's documents
    //TODO: get rid of the hide dependency 'DateTime' from luxon using adapt pattern design
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
          $lt: tomorrow,
        },
      })
      .sort({ createdAt: -1 });

    //get params of date for folio
    const { year, month, day } = DateTime.now();
    //format numbers in order to always get 2 digits
    const format_month = month > 9 ? month : `0${month}`;
    const format_day = day > 9 ? day : `0${day}`;
    const format_year = year.toString().substring(2, 4);
    //if there is no documents start with 01
    if (!last_document)
      return `${type}-${format_year}${format_month}${format_day}-01`;
    //get the number from folio - 01
    const last_number = last_document.folio.split('-')[2];
    //turn the string into number and add 1
    const new_number = +last_number + 1;
    //format numbers in order to always get 2 digits
    const format_number = new_number > 9 ? new_number : `0${new_number}`;
    //generate the new folio and return it VAC-230123-01
    //VAC = type of request
    //230123 = 2023 January 23
    //01 first request of the day
    return `${type}-${format_year}${format_month}${format_day}-${format_number}`;
  }

  //function to catch errors and return answers in all try-catch services functions
  handleError(error: any) {
    //console the error
    console.log(error);

    // error for violation to unique rule in entity
    if (error.code === 11000) {
      throw new BadRequestException(
        `Duplicate ${
          Object.keys(error.keyValue)[Object.keys(error.keyValue).length - 1]
        } : ${
          error.keyValue[
            Object.keys(error.keyValue)[Object.keys(error.keyValue).length - 1]
          ]
        }`,
      );
    }
    // error for any BadRequestException(status 400)
    // most of them are validations
    if (error.response.statusCode === 400) {
      throw new BadRequestException(error.message);
    }

    // any other error once if statements didn't caught the error
    throw new InternalServerErrorException('Server Error, check logs');
  }

  async getResponsibles(model: PreauthorizationsService, employee_id: string) {
    //get responsibles for project--------------------------------------------------
    const resopnsiblesArray = await model.findAll(employee_id);

    if (resopnsiblesArray.length < 1) {
      throw new BadRequestException(
        'You need to register at least one project responsible',
      );
    }

    const formatProjectResponsibles = resopnsiblesArray.map(
      ({
        id_responsible: id,
        name_responsible: name,
        email_responsible: email,
        project_role,
      }) => {
        return {
          id,
          name,
          email,
          project_role,
        };
      },
    );

    return formatProjectResponsibles;
  }

  validateWeekEndDay(date: string) {
    // get the number of weekday
    const weekday = DateTime.fromISO(date).weekday;
    // validate that day is not part of the weekend
    if (weekday > 5) throw new BadRequestException('The day is a weekend day');
  }
}
