import { Controller, Body, Param, Patch } from '@nestjs/common';
import { PreauthorizationsService } from './preauthorizations.service';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { UpdateStatusPreauthorizationDto } from './dto/update-status-preauthorization.dto';

@Controller('preauthorizations')
export class PreauthorizationsController {
  constructor(
    private readonly preauthorizationsService: PreauthorizationsService,
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
}
