import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { UserInformation } from 'src/users/interfaces';
import { Auth, GetUser } from '../users/decorator';
import { ContingenciesService } from './contingencies.service';
import {
  CreateContingencyDto,
  UpdateContingencyDto,
  UpdateStatusContingencyDto,
} from './dto';

@Controller('contingencies-tm')
export class ContingenciesControllerTM {
  constructor(private readonly contingenciesService: ContingenciesService) {}

  @Get('requests')
  @Auth('admin') // only users with role 'admin' can use this
  findAllStatus(@Query() paginationDto: PaginationDto) {
    return this.contingenciesService.findAllByStatus(paginationDto);
  }

  @Patch('requests/update-status/:id')
  @Auth('admin')
  updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateStatusContingencyDto: UpdateStatusContingencyDto,
  ) {
    return this.contingenciesService.updateStatus(
      id,
      updateStatusContingencyDto,
    );
  }

  @Get(':id_employee')
  @Auth('admin') // only users with role 'admin' can use this
  fillAllContingenciesByEmployee(
    @Param('id_employee', ParseIntPipe) id_employee: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.contingenciesService.findAll(id_employee, paginationDto);
  }

  @Post(':id_employee')
  create(
    @Body() createContingencyDto: CreateContingencyDto,
    @Param('id_employee', ParseIntPipe) id_employee: number,
  ) {
    return this.contingenciesService.create(id_employee, createContingencyDto);
  }

  @Patch(':id_employee/:id')
  update(
    @Param('id_employee', ParseIntPipe) id_employee: number,
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateContingencyDto: UpdateContingencyDto,
  ) {
    return this.contingenciesService.update(
      id,
      updateContingencyDto,
      id_employee,
    );
  }

  @Delete(':id_employee/:id')
  remove(
    @Param('id_employee', ParseIntPipe) id_employee: number,
    @Param('id', ParseMongoIdPipe) id: string,
  ) {
    return this.contingenciesService.remove(id, id_employee);
  }
}
