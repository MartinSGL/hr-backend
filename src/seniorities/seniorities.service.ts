import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { Seniority } from './entities/seniority.entity';
import { SeniorityDataRow } from './seniorities.interface';

@Injectable()
export class SenioritiesService {
  constructor(
    @InjectModel(Seniority.name)
    private readonly seniorityServices: Model<Seniority>,
    private readonly commonService: CommonService,
  ) {}
  create(data: SeniorityDataRow[]) {
    try {
      return this.seniorityServices.insertMany(data);
    } catch (error) {
      this.commonService.handleError(error);
    }
  }

  findAll() {
    return this.seniorityServices.find();
  }
}
