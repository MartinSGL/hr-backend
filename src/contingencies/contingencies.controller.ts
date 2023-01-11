import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContingenciesService } from './contingencies.service';
import { CreateContingencyDto } from './dto/create-contingency.dto';
import { UpdateContingencyDto } from './dto/update-contingency.dto';

@Controller('contingencies')
export class ContingenciesController {
  constructor(private readonly contingenciesService: ContingenciesService) {}

  @Post()
  create(@Body() createContingencyDto: CreateContingencyDto) {
    return this.contingenciesService.create(createContingencyDto);
  }

  @Get()
  async findAll() {
    return this.contingenciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contingenciesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContingencyDto: UpdateContingencyDto,
  ) {
    return this.contingenciesService.update(+id, updateContingencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contingenciesService.remove(+id);
  }
}
