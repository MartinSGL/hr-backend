import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { UsersService } from 'src/users/users.service';
import { CreatePreauthorizationDto } from './dto/create-preauthorization.dto';
import { Preauthorization } from './entities/preauthorization.entity';

@Injectable()
export class PreauthorizationsService {
  constructor(
    //model for the rest of transactions that no need pagination
    @InjectModel(Preauthorization.name)
    private readonly preauthorizationModel: Model<Preauthorization>,
    //generic services needed in most of the modules (generateFolio, etc)
    private readonly userService: UsersService,
    //generic services needed in most of the modules (generateFolio, etc)
    private readonly commonService: CommonService,
  ) {}

  async create(
    createPreauthorizationDto: CreatePreauthorizationDto,
    id_employee: number,
  ) {
    try {
      //get the employee name
      const employees = await this.userService.findAll();
      const employee = employees.find(
        (el) => el.email === createPreauthorizationDto.email_responsible,
      );
      //throw error in case email not found
      if (!employee) {
        throw new BadRequestException('incorrect email');
      }

      const preauthorization =
        await this.preauthorizationModel.create<Preauthorization>({
          id_employee,
          ...createPreauthorizationDto,
          name_responsible: employee.name,
        });

      return preauthorization;
    } catch (error) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  async findAll(id_employee: number) {
    const preauthorizations = await this.preauthorizationModel.find({
      id_employee,
    });
    return preauthorizations;
  }

  async remove(id: string, user_id: number) {
    const preauthorizationDeleted =
      await this.preauthorizationModel.findOneAndRemove({
        id,
        id_employee: user_id,
      });
    return preauthorizationDeleted;
  }
}
