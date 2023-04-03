import { Module } from '@nestjs/common';
import { PreauthorizationsModule } from 'src/preauthorizations/preauthorizations.module';
import { CommonService } from './common.service';

//this module has the features that works in more than one module
//example: paginationDto and generateFolio service
@Module({
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
