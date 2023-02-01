import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { UserInformation } from 'src/users/interfaces';
import { Auth, GetUser } from '../users/decorator';
import { ContingenciesService } from './contingencies.service';
import { CreateContingencyDto } from './dto/create-contingency.dto';
import { UpdateContingencyDto } from './dto/update-contingency.dto';

@Controller('contingencies')
@Auth() // decorator that request to the user sending a token
export class ContingenciesController {
  constructor(private readonly contingenciesService: ContingenciesService) {}

  @Post()
  create(
    @Body() createContingencyDto: CreateContingencyDto,
    @GetUser() user: UserInformation,
  ) {
    return this.contingenciesService.create(createContingencyDto, user);
  }

  @Get()
  findAll(
    @GetUser() user: UserInformation,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.contingenciesService.findAll(user, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.contingenciesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateContingencyDto: UpdateContingencyDto,
    @GetUser() user: UserInformation,
  ) {
    return this.contingenciesService.update(id, updateContingencyDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.contingenciesService.remove(id);
  }
}
