import mongoose, { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { CommonService } from 'src/common/common.service';
import { CreateCatalogueDto, UpdateCatalogueDto } from './dto';
import { CatalogueHoliday } from './entities/holiday.entity';

@Injectable()
export class HolidaysService {
  constructor(
    //catalogue of holidays service
    @InjectModel(CatalogueHoliday.name)
    private readonly holidayCatalogueModel: Model<CatalogueHoliday>,
    //generic services needed in contingency services (generateFolio, etc)
    private readonly commonService: CommonService,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async createCatalogue(createCatalogueDto: CreateCatalogueDto, id_tm: number) {
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

  async updateCatalogue(
    id: string,
    updateCatalogueDto: UpdateCatalogueDto,
    id_tm: number,
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

  async deleteCatalogue(id: string) {
    const holidayCatalogue = await this.holidayCatalogueModel.findOneAndDelete({
      _id: id,
    });
    if (!holidayCatalogue)
      throw new BadRequestException('Holiday was not found');
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
  // async addHolidays(createHolidayDto: CreateHolidayDto, id_tm: number) {}
}
