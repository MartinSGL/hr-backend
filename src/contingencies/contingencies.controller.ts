import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
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
  findAll() {
    return this.contingenciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.contingenciesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateContingencyDto: UpdateContingencyDto,
  ) {
    return this.contingenciesService.update(id, updateContingencyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contingenciesService.remove(id);
  }

  @Patch('updateStatus/:id')
  updateStatus(
    @Param('id', ParseMongoIdPipe) id: string,
    //TODO: create another DTO that include status and optional reason, change updateContingencyDto by new DTO
    @Body() updateContingencyDto: UpdateContingencyDto,
  ) {
    return this.contingenciesService.updateStatus(id, updateContingencyDto);
  }
}
