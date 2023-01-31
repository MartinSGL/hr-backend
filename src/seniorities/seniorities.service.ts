import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seniority } from './entities/seniority.entity';
import { SeniorityDataRow } from './seniorities.interface';

@Injectable()
export class SenioritiesService {
  constructor(
    @InjectModel(Seniority.name)
    private readonly seniorityServices: Model<Seniority>,
  ) {}
  create(data: SeniorityDataRow[]) {
    return this.seniorityServices.bulkWrite(data);
  }

  findAll() {
    return `This action returns all seniorities`;
  }
}
