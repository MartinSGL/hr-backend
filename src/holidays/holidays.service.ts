import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';
import {
  CreateCatalogueDto,
  CreateHolidayDto,
  UpdateCatalogueDto,
} from './dto';
import { CatalogueHoliday, Holiday } from './entities/holiday.entity';

@Injectable()
export class HolidaysService {
  constructor(
    //catalogue of holidays service
    @InjectModel(CatalogueHoliday.name)
    private readonly holidayCatalogueModel: Model<CatalogueHoliday>,
    //current holidays of year
    @InjectModel(Holiday.name)
    private readonly holidayModel: Model<Holiday>,
    //generic services needed in contingency services (generateFolio, etc)
    private readonly commonService: CommonService,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async createCatalogue(createCatalogueDto: CreateCatalogueDto, id_tm: string) {
    try {
      createCatalogueDto.name = createCatalogueDto.name.toLowerCase();
      const holidayCatalogue =
        await this.holidayCatalogueModel.create<CatalogueHoliday>({
          ...createCatalogueDto,
          id_tm,
        });

      return holidayCatalogue;
    } catch (error) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  findAllCatalogue() {
    return this.holidayCatalogueModel.find();
  }

  findAllAtiveCatalogue() {
    return this.holidayCatalogueModel.find({ isActive: true });
  }

  async updateCatalogue(
    id: string,
    updateCatalogueDto: UpdateCatalogueDto,
    id_tm: string,
  ) {
    try {
      updateCatalogueDto.name = updateCatalogueDto.name.toLowerCase();
      const holidayCatalogue =
        await this.holidayCatalogueModel.findOneAndUpdate(
          { _id: id },
          { ...updateCatalogueDto, id_tm },
          { new: true },
        );
      if (!holidayCatalogue)
        throw new BadRequestException('Holiday was not found');
      return holidayCatalogue;
    } catch (error) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  async updateCatalogueStatus(id: string) {
    const holidayCatalogue = await this.holidayCatalogueModel.findOne({
      _id: id,
    });
    if (!holidayCatalogue)
      throw new BadRequestException('Holiday was not found');
    holidayCatalogue.isActive = !holidayCatalogue.isActive;
    holidayCatalogue.save();
    return holidayCatalogue;
  }

  async fillCatalogue(holidays: CatalogueHoliday[]) {
    try {
      //turn the holidays' name into lowercase
      const lowerCaseHolidays = holidays.map((holiday) => {
        const name = holiday.name.toLowerCase();
        return { ...holiday, name };
      });

      const session = await this.connection.startSession();

      //This query was made using transactions to be
      //sure that all documents is going to be inserted or none of them
      const res = await session.withTransaction(async () => {
        const holidays = await this.holidayCatalogueModel.insertMany(
          lowerCaseHolidays,
          {
            session,
          },
        );

        return holidays;
      });

      session.endSession();

      return res;
    } catch (error) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  /** services to add current holidays */
  async addHolidays(
    holidaysArr: { holidays: CreateHolidayDto[] },
    year: number,
    id_tm: string,
  ) {
    try {
      const dataToInsert = holidaysArr.holidays.map((holiday) => {
        return { ...holiday, id_tm };
      });

      //TODO:
      // 1.- validate dates are not weekends
      // esta en servicios en contingency

      holidaysArr.holidays.forEach((el) => {
        this.commonService.validateWeekEndDay(String(el.date));

        //validar que año coincida con la fecha
      });

      // 2.- validate that dates match with the year given
      // 3.- check transactions or validate that dates are not duplicated
      // throw new BadRequestException('messsage')

      //start transactions to delete and reinsert
      const session = await this.connection.startSession();
      await session.withTransaction(async () => {
        await this.holidayModel.deleteMany(
          {
            date: {
              $gte: `${year}-01-01`,
              $lte: `${year + 1}-01-01`,
            },
          },
          {
            session,
          },
        );

        await this.holidayModel.insertMany(dataToInsert, { session });
      });

      session.endSession();

      return 'holidays has been capture successfuly';
    } catch (error: any) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  findAll(year: number) {
    const first_day_of_year = new Date(`${year}-01-01`);
    const first_day_of_next_year = new Date(`${year + 1}-01-01`);

    const aggregatorOpts = [
      {
        $match: {
          date: { $gte: first_day_of_year, $lt: first_day_of_next_year },
        },
      },
      {
        $lookup: {
          from: 'catalogueholidays',
          localField: 'id_holiday',
          foreignField: '_id',
          as: 'holidays',
        },
      },
      {
        $project: { _id: 1, date: 1, 'holidays.name': 1 },
      },
    ];

    return this.holidayModel.aggregate(aggregatorOpts);
    // return this.holidayModel.aggregate(aggregatorOpts);
  }
}
