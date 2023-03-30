import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { PreauthorizationsService } from './preauthorizations.service';
import { CreatePreauthorizationDto } from './dto/create-preauthorization.dto';
import { Auth, GetUser } from 'src/users/decorator';
import { UserInformation } from 'src/users/interfaces';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';

@Controller('preauthorizations')
@Auth()
export class PreauthorizationsController {
  constructor(
    private readonly preauthorizationsService: PreauthorizationsService,
  ) {}

  @Post()
  create(
    @Body() createPreauthorizationDto: CreatePreauthorizationDto,
    @GetUser() user: UserInformation,
  ) {
    return this.preauthorizationsService.create(
      createPreauthorizationDto,
      user.id,
    );
  }

  @Get()
  findAll(@GetUser() user: UserInformation) {
    return this.preauthorizationsService.findAll(user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseMongoIdPipe) id: string,
    @GetUser() user: UserInformation,
  ) {
    return this.preauthorizationsService.remove(id, user.id);
  }
}
