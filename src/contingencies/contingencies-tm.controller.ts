import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { Auth } from '../users/decorator';
import { ContingenciesService } from './contingencies.service';
import { UpdateStatusContingencyDto } from './dto';

@Controller('contingencies-tm')
export class ContingenciesControllerTM {
  constructor(private readonly contingenciesService: ContingenciesService) {}

  @Get('request')
  @Auth('admin') // only users with role 'admin' can use this
  findAllStatus(@Query() paginationDto: PaginationDto) {
    return this.contingenciesService.findAllByStatus(paginationDto);
  }

  @Patch('update-status/:id')
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
}
