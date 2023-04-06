import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProjectResponsablesService } from './project-responsables.service';
import { CreateProjectResponsableDto } from './dto/create-project-responsable.dto';
import { Auth, GetUser } from 'src/users/decorator';
import { UserInformation } from 'src/users/interfaces';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';

@Controller('project-responsables')
@Auth() // decorator that request to the user sending a token
export class ProjectResponsablesController {
  constructor(
    private readonly projectResponsablesService: ProjectResponsablesService,
  ) {}

  @Post()
  create(
    @Body() createProjectResponsableDto: CreateProjectResponsableDto,
    @GetUser() user: UserInformation,
  ) {
    return this.projectResponsablesService.create(
      createProjectResponsableDto,
      user.id,
    );
  }

  @Get()
  findAll(@GetUser() user: UserInformation) {
    return this.projectResponsablesService.findAll(user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseMongoIdPipe) id: string,
    @GetUser() user: UserInformation,
  ) {
    return this.projectResponsablesService.remove(id, user.id);
  }
}
