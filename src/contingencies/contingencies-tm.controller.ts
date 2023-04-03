import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
    @Param('id') id: string,
    @Body() updateStatusContingencyDto: UpdateStatusContingencyDto,
    @GetUser() user: UserInformation,
  ) {
    return this.contingenciesService.updateStatus(
      id,
      updateStatusContingencyDto,
      user.id,
    );
  }

  @Get(':id_employee')
  @Auth('admin') // only users with role 'admin' can use this
  fillAllContingenciesByEmployee(
    @Param('id_employee') id_employee: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.contingenciesService.findAll(id_employee, paginationDto);
  }

  @Post(':id_employee')
  @Auth('admin') // only users with role 'admin' can use this
  create(
    @Body() createContingencyDto: CreateContingencyDto,
    @Param('id_employee') id_employee: string,
    @GetUser() user: UserInformation,
  ) {
    return this.contingenciesService.create(
      id_employee,
      createContingencyDto,
      user.id,
    );
  }

  @Patch(':id_employee/:id')
  @Auth('admin') // only users with role 'admin' can use this
  update(
    @Param('id_employee') id_employee: string,
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
  @Auth('admin') // only users with role 'admin' can use this
  remove(
    @Param('id_employee') id_employee: string,
    @Param('id', ParseMongoIdPipe) id: string,
    @GetUser() user: UserInformation,
  ) {
    return this.contingenciesService.remove(id, id_employee, user.id);
  }
}
