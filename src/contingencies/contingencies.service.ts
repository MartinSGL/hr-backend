import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContingencyDto } from './dto/create-contingency.dto';
import { UpdateContingencyDto } from './dto/update-contingency.dto';
import { Contingency } from './entities/contingency.entity';

@Injectable()
export class ContingenciesService {
  constructor(
    @InjectModel(Contingency.name)
    private readonly contingencyModel: Model<Contingency>,
  ) {}

  async create(createContingencyDto: CreateContingencyDto) {
    try {
      const contigency = await this.contingencyModel.create<Contingency>({
        folio: 'CON-090123-01',
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

  findOne(id: number) {
    return `This action returns a #${id} contingency`;
  }

  update(id: number, updateContingencyDto: UpdateContingencyDto) {
    return `This action updates a #${id} contingency`;
  }

  remove(id: number) {
    return `This action removes a #${id} contingency`;
  }
}
