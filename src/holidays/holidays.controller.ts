import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { Auth, GetUser } from 'src/users/decorator';
import { UserInformation } from 'src/users/interfaces';
import {
  CreateCatalogueDto,
  CreateHolidayDto,
  UpdateCatalogueDto,
} from './dto';
import { HolidaysService } from './holidays.service';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Post('catalogue')
  @Auth('admin')
  createCatalogue(
    @Body() createCatalogueDto: CreateCatalogueDto,
    @GetUser() user: UserInformation,
  ) {
    return this.holidaysService.createCatalogue(createCatalogueDto, user.id);
  }

  @Get('catalogue')
  @Auth('admin')
  findAllCatalogue() {
    return this.holidaysService.findAllCatalogue();
  }

  @Get('catalogue-active')
  @Auth('admin')
  findAllAtiveCatalogue() {
    return this.holidaysService.findAllAtiveCatalogue();
  }

  @Patch('catalogue/:id')
  @Auth('admin')
  updateCatalogue(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCatalogueDto: UpdateCatalogueDto,
    @GetUser() user: UserInformation,
  ) {
    return this.holidaysService.updateCatalogue(
      id,
      updateCatalogueDto,
      user.id,
    );
  }

  @Delete('catalogue/:id')
  @Auth('admin')
  updateCatalogueStatus(@Param('id', ParseMongoIdPipe) id: string) {
    return this.holidaysService.updateCatalogueStatus(id);
  }

  @Post('current')
  @Auth('admin')
  addHolidays(
    @Body() holidaysArr: { holidays: CreateHolidayDto[] },
    @Body('year', ParseIntPipe) year: number,
    @GetUser() user: UserInformation,
  ) {
    return this.holidaysService.addHolidays(holidaysArr, year, user.id);
  }

  @Get('current/:year')
  @Auth()
  findAll(@Param('year', ParseIntPipe) year: number) {
    return this.holidaysService.findAll(year);
  }
}
