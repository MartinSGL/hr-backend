import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { VacationsService } from './vacations.service';
import { CreateVacationDto } from './dto/create-vacation.dto';
import { UpdateVacationDto } from './dto/update-vacation.dto';
import { Auth, GetUser } from 'src/users/decorator';
import { UserInformation } from 'src/users/interfaces';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vacations')
@Auth()
export class VacationsController {
  constructor(private readonly vacationsService: VacationsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('client_evidence'))
  create(
    @Body() createVacationDto: CreateVacationDto,
    @UploadedFile(
      //TODO: make decorator or add it to the dto to make the code cleaner
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1100000, //bytes
        })
        .build({
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    )
    client_evidence: Express.Multer.File,
    @GetUser() user: UserInformation,
  ) {
    return this.vacationsService.create(
      user.id,
      createVacationDto,
      client_evidence,
      user.id,
      user.name,
    );
  }

  @Get()
  findAll() {
    return this.vacationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVacationDto: UpdateVacationDto,
  ) {
    return this.vacationsService.update(+id, updateVacationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vacationsService.remove(+id);
  }
}
