import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { CreateCatalogueDto, UpdateCatalogueDto } from './dto';
import { HolidayCatalogue } from './entities/holiday.entity';

@Injectable()
export class HolidaysService {
  constructor(
    //catalogue of holidays service
    @InjectModel(HolidayCatalogue.name)
    private readonly holidayCatalogueModel: Model<HolidayCatalogue>,
    //generic services needed in contingency services (generateFolio, etc)
    private readonly commonService: CommonService,
  ) {}
  async createCatalogue(createCatalogueDto: CreateCatalogueDto, id_tm: number) {
    try {
      createCatalogueDto.name = createCatalogueDto.name.toLowerCase();
      const holidayCatalogue =
        await this.holidayCatalogueModel.create<HolidayCatalogue>({
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

  async fillCatalogue(holidays: HolidayCatalogue[]) {
    try {
      const lowerCaseHolidays = holidays.map((holiday) => {
        const name = holiday.name.toLowerCase();
        return { ...holiday, name };
      });

      const resp = await this.holidayCatalogueModel.insertMany(
        lowerCaseHolidays,
      );

      return resp;
    } catch (error) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }
}
