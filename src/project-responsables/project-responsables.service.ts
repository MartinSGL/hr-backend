import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommonService } from 'src/common/common.service';
import { UsersService } from 'src/users/users.service';
import { CreateProjectResponsableDto } from './dto/create-project-responsable.dto';
import { ProjectResponsable } from './entities/project-responsable.entity';

@Injectable()
export class ProjectResponsablesService {
  constructor(
    //model for the rest of transactions that no need pagination
    @InjectModel(ProjectResponsable.name)
    private readonly preauthorizationModel: Model<ProjectResponsable>,
    //generic services needed in most of the modules (generateFolio, etc)
    private readonly userService: UsersService,
    //generic services needed in most of the modules (generateFolio, etc)
    private readonly commonService: CommonService,
  ) {}

  async create(
    createProjectResponsableDto: CreateProjectResponsableDto,
    id_employee: string,
  ) {
    try {
      //get the employee name
      const employees = await this.userService.findAll();
      const employee = employees.find(
        (el) => el.email === createProjectResponsableDto.email_responsible,
      );
      //throw error in case email not found
      if (!employee) {
        throw new BadRequestException('incorrect email');
      }

      const preauthorization =
        await this.preauthorizationModel.create<ProjectResponsable>({
          id_employee,
          ...createProjectResponsableDto,
          name_responsible: employee.name,
        });

      return preauthorization;
    } catch (error) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }

  async findAll(id_employee: string) {
    const preauthorizations = await this.preauthorizationModel.find({
      id_employee,
    });
    return preauthorizations;
  }

  async remove(id: string, user_id: string) {
    try {
      const preauthorizationDeleted =
        await this.preauthorizationModel.findOneAndRemove({
          id,
          id_employee: user_id,
        });
      return preauthorizationDeleted;
    } catch (error) {
      //global function to handdle the error
      this.commonService.handleError(error);
    }
  }
}
