import { Module } from '@nestjs/common';
import { PreauthorizationsService } from './preauthorizations.service';
import { PreauthorizationsController } from './preauthorizations.controller';
import { UsersModule } from 'src/users/users.module';
import { ContingenciesModule } from '../contingencies/contingencies.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [PreauthorizationsController],
  providers: [PreauthorizationsService],
  imports: [UsersModule, ContingenciesModule, CommonModule],
  exports: [PreauthorizationsService],
})
export class PreauthorizationsModule {}
