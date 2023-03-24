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
import { PaginationDto } from '../common/dto/pagination.dto';
import * as mockData from '../users/mock-data/mock-users.json';

@Injectable()
export class ContingenciesService {
  constructor(
    //model for the rest of transactions that no need pagination
    @InjectModel(Contingency.name)
    private readonly contingencyModel: Model<Contingency>,
    //model used to easier the pagination using library mongoose-paginate-v2
    @InjectModel(Contingency.name)
    private readonly contingencyModelPag: PaginateModel<ContingencyDocument>,
    //generic services needed in most of the modules (generateFolio, etc)
    private readonly commonService: CommonService,
  ) {}

  async create(
    employee_id: number,
    createContingencyDto: CreateContingencyDto,
    createdBy: number,
    employee_name?: string,
  ) {
    try {
      //get the information of user depends on type of request (tm-request or employee request)
      let name;
      if (!employee_name) {
        const employee = mockData.users.find((user) => user.id === employee_id);
        name = employee.name;
      } else {
        name = employee_name;
      }

      /*--------------------------- Validations ----------------------------------* */
      //validate that day is not part of the weekend
      this.validateWeekEndDay(String(createContingencyDto.date));
      // validate day is not already taken
      await this.valitateDay(employee_id, createContingencyDto.date);
      // validate user has no more than 3 days
      await this.valitateNumberOfDays(employee_id);
      /*----------------------------------------------------------------------------* */
      // get the friendly folio
      const folio = await this.commonService.generateFolio(
        this.contingencyModel,
        'CON',
      );

      //create contingency
      const contigency = await this.contingencyModel.create<Contingency>({
        folio: folio,
        id_employee: employee_id,
        name_employee: name,
        ...createContingencyDto,
        createdBy,
      });

      return { folio: contigency.folio };
    } catch (error: any) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  async findAll(id_employee: number, paginationDto: PaginationDto) {
    const options = {
      select: ['-__v', '-createdAt', '-updatedAt', '-id_tm', '-createdBy'],
      sort: { _id: -1 },
      page: paginationDto.page,
      limit: 5,
    };
    const query = { id_employee: id_employee };

    //get days and numbers of days taken
    const { totalContingencies, days } = await this.getNumerOfDaysAndDaysTaken(
      id_employee,
    );

    const contingencies = await this.contingencyModelPag.paginate(
      query,
      options,
    );

    return {
      days_taken: days,
      total_contingencies: totalContingencies,
      ...contingencies,
    };
  }

  async findAllByStatus(paginationDto: PaginationDto) {
    const options = {
      select: ['-__v', '-createdAt', '-updatedAt', '-id_tm', '-createdBy'],
      sort: { _id: -1 },
      page: paginationDto.page,
      limit: 5,
    };
    const query = { status: 'pending' };
    return this.contingencyModelPag.paginate(query, options);
  }

  async findOne(id: string, id_employee: number) {
    const contingency = await this.contingencyModel.findOne({
      _id: id,
      id_employee,
    });
    //return exception in case contingency is not found
    if (!contingency)
      throw new BadRequestException('Contingency was not found');
    return contingency;
  }

  async update(
    id: string,
    updateContingencyDto: UpdateContingencyDto,
    employee_id: number,
  ) {
    try {
      /*--------------------------- Validations ----------------------------------* */
      // validate that day is not part of the weekend
      this.validateWeekEndDay(String(updateContingencyDto.date));
      // validate day is not already taken
      await this.valitateDay(employee_id, updateContingencyDto.date, id);
      // validate user has no more than 3 days
      await this.valitateNumberOfDays(employee_id);

      /*----------------------------------------------------------------------------* */
      //find and update the document
      const contingencyUpdated = await this.contingencyModel.findOneAndUpdate(
        { _id: id, employee_id: employee_id },
        { ...updateContingencyDto, status: 'pending' },
        { new: true },
      );
      //return exception in case contingency is not found
      if (!contingencyUpdated)
        throw new BadRequestException('Contingency is not valid');
      return { folio: contingencyUpdated.folio };
    } catch (error: any) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  async remove(id: string, id_employee: number, id_tm = 0) {
    //find the documents
    const contingency = await this.findOne(id, id_employee);
    //change the status to canceled if status is already approved
    if (contingency.status === 'approved') {
      return this.updateStatus(id, { status: 'canceled' }, id_tm);
    }
    //delete document in case another status
    const contingencyDeleted = await contingency.deleteOne({
      _id: id,
      id_employee: id_employee,
    });

    return { folio: contingencyDeleted.folio };
  }

  async updateStatus(
    id: string,
    updateStatusContingencyDto: UpdateStatusContingencyDto,
    id_tm: number,
  ) {
    // validate that if the status is rejected then the observations field must not be empty
    if (
      updateStatusContingencyDto.status === status.rejected &&
      !updateStatusContingencyDto.observations
    ) {
      throw new BadRequestException('Observations must not be empty');
    }

    // find the document, change the status and observations(only if request is rejected)
    const contingencyUpdated = await this.contingencyModel.findOneAndUpdate(
      { _id: id },
      { ...updateStatusContingencyDto, id_tm },
      { new: true },
    );
    if (!contingencyUpdated)
      throw new BadRequestException('Contingency was not found');
    return { folio: contingencyUpdated.folio };
  }

  // valdiate that the day requested is not already taken
  private async valitateDay(id_employee: number, date: Date, id?: string) {
    let contingency;
    if (!id) {
      // create operation
      contingency = await this.contingencyModel.findOne({
        id_employee,
        date,
        status: { $ne: 'canceled' },
      });
    } else {
      // update operation
      contingency = await this.contingencyModel.findOne({
        id_employee,
        date,
        status: { $ne: 'canceled' },
        _id: { $ne: id },
      });
    }

    if (contingency) throw new BadRequestException('The date is already taken');
  }

  // validate that employee has still avaliables days or halfdays
  private async valitateNumberOfDays(id_employee: number) {
    // half_days return true if employee has halfdays
    const { totalContingencies } = await this.getNumerOfDaysAndDaysTaken(
      id_employee,
    );

    if (totalContingencies >= 3)
      throw new BadRequestException('No more avaliables contingency days');
  }

  async getNumerOfDaysAndDaysTaken(id_employee: number) {
    // get the current day
    // TODO: get rid of this hiden dependency (DateTime)
    const { year } = DateTime.now();
    const first_day = new Date(`${year}-01-01`);
    const last_day = new Date(`${year + 1}-01-01`);

    //find documents of current year
    const contingencies = await this.contingencyModel.find({
      date: {
        $gte: first_day,
        $lt: last_day,
      },
      id_employee,
      status: { $ne: 'canceled' },
    });

    const days = [];
    //push dates within the array
    contingencies.forEach((el) => {
      days.push(el.date);
    });

    return {
      totalContingencies: contingencies.length,
      days,
    };
  }

  // validate contingecy is not a weekend day
  validateWeekEndDay(date: string) {
    // get the number of weekday
    const weekday = DateTime.fromISO(date).weekday;
    // validate that day is not part of the weekend
    if (weekday > 5) throw new BadRequestException('The day is a weekend day');
  }
}
