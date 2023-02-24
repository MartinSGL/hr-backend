import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { Vacation, VacationDocument } from './entities/vacation.entity';
import * as mockData from '../users/mock-data/mock-users.json';

@Injectable()
export class VacationsService {
  constructor(
    //model for the rest of transactions that no need pagination
    @InjectModel(Vacation.name)
    private readonly vacationModel: Model<Vacation>,
    //model used to easier the pagination using library mongoose-paginate-v2
    @InjectModel(Vacation.name)
    private readonly vacationModelPag: PaginateModel<VacationDocument>,
    //generic services needed in contingency services (generateFolio, etc)
    private readonly commonService: CommonService,
  ) {}
  async create(
    employee_id: number,
    createVacationDto: CreateVacationDto,
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
      /*TODO:make validations*/

      // get the friendly folio
      const folio = await this.commonService.generateFolio(
        this.vacationModel,
        'VAC',
      );

      const vacations = await this.vacationModel.create({
        folio: folio,
        id_employee: employee_id,
        name_employee: name,
        ...createVacationDto,
        createdBy,
      });

      return { folio: vacations.folio };
    } catch (error) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  findAll() {
    return `This action returns all vacations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vacation`;
  }

  update(id: number, updateVacationDto: UpdateVacationDto) {
    return `This action updates a #${id} vacation`;
  }

  remove(id: number) {
    return `This action removes a #${id} vacation`;
  }
}
