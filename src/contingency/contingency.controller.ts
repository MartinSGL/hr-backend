import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContingencyService } from './contingency.service';
import { CreateContingencyDto } from './dto/create-contingency.dto';
import { UpdateContingencyDto } from './dto/update-contingency.dto';

@Controller('contingency')
export class ContingencyController {
  constructor(private readonly contingencyService: ContingencyService) {}

  @Post()
  create(@Body() createContingencyDto: CreateContingencyDto) {
    return this.contingencyService.create(createContingencyDto);
  }

  @Get()
  findAll() {
    return this.contingencyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contingencyService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContingencyDto: UpdateContingencyDto,
  ) {
    return this.contingencyService.update(+id, updateContingencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contingencyService.remove(+id);
  }
}
