import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContingencyDto } from './dto/create-contingency.dto';
import { UpdateContingencyDto } from './dto/update-contingency.dto';
import { Contingency } from './entities/contingency.entity';
import { CommonService } from '../common/common.service';
import { UpdateStatusContingencyDto } from './dto/updateStatus-contingency.dto';
import { status } from 'src/common/interfaces/status.interface';
import { DateTime } from 'luxon';

@Injectable()
export class ContingenciesService {
  constructor(
    @InjectModel(Contingency.name)
    private readonly contingencyModel: Model<Contingency>,
    private readonly commonService: CommonService,
  ) {}

  async create(createContingencyDto: CreateContingencyDto) {
    try {
      /*--------------------------- Validations ----------------------------------* */
      //validate that day is not part of the weekend
      this.validateWeekDay(String(createContingencyDto.date));
      // validate day is not already taken
      await this.valitateDate(1, createContingencyDto.date);
      // validate user has no more than 3 days
      await this.valitateNumberDays(1, createContingencyDto.half_day, 'create');
      /*----------------------------------------------------------------------------* */

      // get the friendly folio
      const folio = await this.commonService.generateFolio(
        this.contingencyModel,
        'CON',
      );

      //create contingency
      const contigency = await this.contingencyModel.create<Contingency>({
        folio,
        id_employee: 1,
        id_tm: 2,
        ...createContingencyDto,
      });

      return contigency;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Folio already exists ${JSON.stringify(error.keyValue)}`,
        );
      }
      if (error.response.statusCode === 400) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async findAll() {
    return this.contingencyModel.find({ status: 'pending' });
  }

  async findOne(id: string) {
    const contingency = await this.contingencyModel.findOne({ _id: id });
    //return exception in case contingency is not found
    if (!contingency)
      throw new BadRequestException('Contingency was not found');
    return contingency;
  }

  async update(id: string, updateContingencyDto: UpdateContingencyDto) {
    /*--------------------------- Validations ----------------------------------* */
    //validate that day is not part of the weekend
    this.validateWeekDay(String(updateContingencyDto.date));
    // validate day is not already taken
    await this.valitateDate(1, updateContingencyDto.date, id);
    // validate user has no more than 3 days
    await this.valitateNumberDays(1, updateContingencyDto.half_day, 'update');
    /*----------------------------------------------------------------------------* */
    //find and update the document
    const contingencyUpdated = await this.contingencyModel.findOneAndUpdate(
      { _id: id },
      updateContingencyDto,
      { new: true },
    );
    //return exception in case contingency is not found
    if (!contingencyUpdated)
      throw new BadRequestException('Contingency is not valid');
    return contingencyUpdated;
  }

  async remove(id: string) {
    //find and update the document
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
    //validate that if the status is rejected then the reason is not empty
    if (
      updateStatusContingencyDto.status === status.rejected &&
      !updateStatusContingencyDto.reason
    ) {
      throw new BadRequestException('Reason must not be empty');
    }

    //find the document, change the status and reason only if it is rejected
    const contingencyUpdated = await this.contingencyModel.findOneAndUpdate(
      { _id: id },
      updateStatusContingencyDto,
      { new: true },
    );
    if (!contingencyUpdated)
      throw new BadRequestException('Contingency was not found');
    return contingencyUpdated;
  }

  private async valitateDate(id_employee: number, date: Date, id?: string) {
    let contingency;
    if (!id) {
      //create operation
      contingency = await this.contingencyModel.findOne({
        id_employee,
        date,
      });
    } else {
      //update operation
      contingency = await this.contingencyModel.findOne({
        id_employee,
        date,
        _id: { $ne: id },
      });
    }

    if (contingency) throw new BadRequestException('The date is already taken');
  }

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

  validateWeekDay(date: string) {
    //get the number of weekday
    const weekday = DateTime.fromISO(date).weekday;
    //validate that day is not part of the weekend
    if (weekday > 5) throw new BadRequestException('The day is a weekend day');
  }
}
