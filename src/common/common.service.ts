import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  RequestType,
  TypeRequestFolio,
} from './interfaces/type-request.interface';
import { TokenPreauthorization } from './entities/token-preauthorization.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectResponsablesService } from 'src/project-responsables/project-responsables.service';

@Injectable()
export class CommonService {
  constructor(
    //generate token to encrypt the payload of url preauthorization
    private readonly jwtTokenService: JwtService,
    //get variables from env
    private readonly configService: ConfigService,
    //save the url for preauthorizations
    @InjectModel(TokenPreauthorization.name)
    private readonly tokenPreauthorizationModel: Model<TokenPreauthorization>,
  ) {}

  //functon to generate folio according to the type of request
  async generateFolio(
    model: Model<any>,
    type: TypeRequestFolio[keyof TypeRequestFolio],
  ) {
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

  async getResponsibles(
    service: ProjectResponsablesService,
    employee_id: string,
  ) {
    //get responsibles for project--------------------------------------------------
    const responsiblesArray = await service.findAll(employee_id);

    if (responsiblesArray.length < 1) {
      throw new BadRequestException(
        'You need to register at least one project responsible',
      );
    }

    const formatProjectResponsibles = responsiblesArray.map(
      ({ name_responsible: name, email_responsible: email, project_role }) => {
        return {
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

  async generateUrlJWTForEmail(data: {
    email_responsible: string;
    id_request: Types.ObjectId;
    folio: string;
    dates: string[];
    requestType: RequestType;
  }) {
    try {
      const { email_responsible, id_request, folio, dates, requestType } = data;

      const token = this.jwtTokenService.sign({
        email_responsible,
        id_request,
        folio,
        dates,
        requestType,
      });

      const base = this.configService.get('request_preauthorization_url_base');
      const url = `${base}?hash=${token}`;

      await this.tokenPreauthorizationModel.create<TokenPreauthorization>({
        id_request,
        token,
      });

      return url;
    } catch (error) {
      this.handleError(error);
    }
  }

  //every time status of preauthorizations is changed by email
  //token is deleted from collection to avoid use token-url again
  async deleteUrlJWTForEmail(token) {
    try {
      await this.tokenPreauthorizationModel.deleteOne({
        token,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteUrlJWTForEmailByRequest(id_request: string) {
    try {
      await this.tokenPreauthorizationModel.deleteMany({
        id_request,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async valitateTokenUrl(token: string) {
    const urlToken = await this.tokenPreauthorizationModel.findOne({ token });
    if (!urlToken) {
      throw new BadRequestException('token not found');
    }
    return urlToken;
  }
}
