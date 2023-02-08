import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import {
  CreateContingencyDto,
  UpdateContingencyDto,
  UpdateStatusContingencyDto,
} from './dto';
import {
  Contingency,
  ContingencyDocument,
} from './entities/contingency.entity';
import { CommonService } from '../common/common.service';
import { status } from 'src/common/interfaces/status.interface';
import { DateTime } from 'luxon';
import { UserInformation } from 'src/users/interfaces';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class ContingenciesService {
  constructor(
    //model for the rest of transactions that no need pagination
    @InjectModel(Contingency.name)
    private readonly contingencyModel: Model<Contingency>,
    //model used to easier the pagination using library mongoose-paginate-v2
    @InjectModel(Contingency.name)
    private readonly contingencyModelPag: PaginateModel<ContingencyDocument>,
    //generic services needed in contingency services (generateFolio, etc)
    private readonly commonService: CommonService,
  ) {}

  async create(
    createContingencyDto: CreateContingencyDto,
    user: UserInformation,
  ) {
    try {
      /*--------------------------- Validations ----------------------------------* */
      //validate that day is not part of the weekend
      this.validateWeekDay(String(createContingencyDto.date));
      // validate day is not already taken
      await this.valitateDate(user.id, createContingencyDto.date);
      // validate user has no more than 3 days
      await this.valitateNumberDays(
        user.id,
        createContingencyDto.half_day,
        'create',
      );
      /*----------------------------------------------------------------------------* */

      // get the friendly folio
      const folio = await this.commonService.generateFolio(
        this.contingencyModel,
        'CON',
      );

      //create contingency
      const contigency = await this.contingencyModel.create<Contingency>({
        folio: folio,
        id_employee: user.id,
        name_employee: user.name,
        ...createContingencyDto,
      });

      return contigency;
    } catch (error: any) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  async findAll(user: UserInformation, paginationDto: PaginationDto) {
    const options = { page: paginationDto.page, limit: 5 };
    const query = { id_employee: user.id };
    return this.contingencyModelPag.paginate(query, options);
  }

  async findAllByStatus(paginationDto: PaginationDto) {
    const options = { page: paginationDto.page, limit: 5 };
    const query = { status: 'pending' };
    return this.contingencyModelPag.paginate(query, options);
  }

  async findOne(id: string) {
    const contingency = await this.contingencyModel.findOne({ _id: id });
    //return exception in case contingency is not found
    if (!contingency)
      throw new BadRequestException('Contingency was not found');
    return contingency;
  }

  async update(
    id: string,
    updateContingencyDto: UpdateContingencyDto,
    user: UserInformation,
  ) {
    try {
      /*--------------------------- Validations ----------------------------------* */
      //validate that day is not part of the weekend
      this.validateWeekDay(String(updateContingencyDto.date));
      // validate day is not already taken
      await this.valitateDate(user.id, updateContingencyDto.date, id);
      // validate user has no more than 3 days
      await this.valitateNumberDays(
        user.id,
        updateContingencyDto.half_day,
        'update',
      );
      /*----------------------------------------------------------------------------* */
      //find and update the document
      const contingencyUpdated = await this.contingencyModel.findOneAndUpdate(
        { _id: id },
        { ...updateContingencyDto, status: 'pending' },
        { new: true },
      );
      //return exception in case contingency is not found
      if (!contingencyUpdated)
        throw new BadRequestException('Contingency is not valid');
      return contingencyUpdated;
    } catch (error: any) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  async remove(id: string) {
    //find and delete the document
    const contingencyDeleted = await this.contingencyModel.findOneAndDelete({
      _id: id,
    });
    //return exception in case contingency is not found
    if (!contingencyDeleted)
      throw new BadRequestException('Contingency is not valid');
    return contingencyDeleted;
  }

  async updateStatus(
    id: string,
    updateStatusContingencyDto: UpdateStatusContingencyDto,
  ) {
    //validate that if the status is rejected then the observations field must not be empty
    if (
      updateStatusContingencyDto.status === status.rejected &&
      !updateStatusContingencyDto.observations
    ) {
      throw new BadRequestException('Observations must not be empty');
    }

    //find the document, change the status and observations(only if request is rejected)
    const contingencyUpdated = await this.contingencyModel.findOneAndUpdate(
      { _id: id },
      updateStatusContingencyDto,
      { new: true },
    );
    if (!contingencyUpdated)
      throw new BadRequestException('Contingency was not found');
    return contingencyUpdated;
  }

  //valdiate that the day requested is not already taken
  private async valitateDate(id_employee: number, date: Date, id?: string) {
    let contingency;
    if (!id) {
      //create operation
      contingency = await this.contingencyModel.findOne({
        id_employee,
        date,
        status: { $ne: 'canceled' },
      });
    } else {
      //update operation
      contingency = await this.contingencyModel.findOne({
        id_employee,
        date,
        status: { $ne: 'canceled' },
        _id: { $ne: id },
      });
    }

    if (contingency) throw new BadRequestException('The date is already taken');
  }

  //validate that employee has still avaliables days or halfdays
  private async valitateNumberDays(
    id_employee: number,
    half_day: boolean,
    operation: 'create' | 'update',
  ) {
    //get the current day
    //TODO: get rid of this hide dependency (DateTime)
    const { year } = DateTime.now();
    const first_day = new Date(`${year}-01-01`);
    const last_day = new Date(`${year + 1}-01-01`);

    //make agregation structure
    const aggregatorOpts = [
      {
        $match: {
          id_employee,
          date: {
            $gte: first_day,
            $lte: last_day,
          },
          status: { $ne: 'canceled' },
        },
      },
      {
        $group: {
          _id: '$half_day',
          count: { $sum: 1 },
        },
      },
    ];

    //execute the agregation
    const countContingencies = await this.contingencyModel.aggregate(
      aggregatorOpts,
    );
    //start the count in 0
    let totalContingencies = 0;
    //start adding depending on half day or not
    countContingencies.forEach((el) => {
      if (el._id === false) {
        //complete day
        totalContingencies = totalContingencies + el.count;
      } else {
        //half day
        totalContingencies = totalContingencies + el.count * 0.5;
      }
    });

    if (operation === 'create') {
      if (totalContingencies >= 2.5 && !half_day)
        throw new BadRequestException(
          'You have no more avaliables contingency days (complete days)',
        );

      if (
        (totalContingencies >= 3 && half_day) ||
        (totalContingencies >= 3 && !half_day)
      )
        throw new BadRequestException(
          'You have no more avaliables contingency days (complete and half days)',
        );
    } else {
      if (totalContingencies >= 2.5 && !half_day)
        throw new BadRequestException(
          'You have no more avaliables complete contingecy days',
        );
    }
  }

  //validate contingecy is not a weekend day
  validateWeekDay(date: string) {
    //get the number of weekday
    const weekday = DateTime.fromISO(date).weekday;
    //validate that day is not part of the weekend
    if (weekday > 5) throw new BadRequestException('The day is a weekend day');
  }
}
