import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContingencyDto } from './dto/create-contingency.dto';
import { UpdateContingencyDto } from './dto/update-contingency.dto';
import { Contingency } from './entities/contingency.entity';
import { CommonService } from '../common/common.service';

@Injectable()
export class ContingenciesService {
  constructor(
    @InjectModel(Contingency.name)
    private readonly contingencyModel: Model<Contingency>,
    private readonly commonService: CommonService,
  ) {}

  async create(createContingencyDto: CreateContingencyDto) {
    try {
      //TODO: generate another funcion in the service that validate date is no already register to the same employee
      //@param(id_employee,date,type(create,update))
      this.valitateDate();
      //get the friendly folio
      const folio = await this.commonService.generateFolio(
        this.contingencyModel,
        'CON',
      );

      //validate day
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
    }
  }

  async findAll() {
    const contingency = await this.contingencyModel.find({ status: 'pending' });
    return {
      error: false,
      data: contingency,
    };
  }

  async findOne(id: string) {
    const contingency = await this.contingencyModel.findOne({ _id: id });
    if (!contingency)
      throw new BadRequestException('Contingency was not found');
    return contingency;
  }

  async update(id: string, updateContingencyDto: UpdateContingencyDto) {
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

  //TODO:update status required, and reason optional
  async updateStatus(id: string, updateContingencyDto: UpdateContingencyDto) {
    return;
  }
  //TODO:
  private async valitateDate() {
    return;
  }
}
