import { Controller, Body, Param, Patch, Get } from '@nestjs/common';
import { PreauthorizationsService } from './preauthorizations.service';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { UpdateStatusPreauthorizationDto } from './dto/update-status-preauthorization.dto';
import { CommonService } from 'src/common/common.service';

@Controller('preauthorizations')
export class PreauthorizationsController {
  constructor(
    private readonly preauthorizationsService: PreauthorizationsService,
    private readonly commonService: CommonService,
  ) {}

  @Patch(':id')
  create(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateStatusPreauthorizationDto: UpdateStatusPreauthorizationDto,
  ) {
    return this.preauthorizationsService.updateStatus(
      id,
      updateStatusPreauthorizationDto,
    );
  }

  @Get('valitate-token-url/:token')
  valitateTokenUrl(@Param('token') token: string) {
    return this.commonService.valitateTokenUrl(token);
  }
}
