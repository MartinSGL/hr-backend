import { Module } from '@nestjs/common';
import { PreauthorizationsService } from './preauthorizations.service';
import { PreauthorizationsController } from './preauthorizations.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Preauthorization,
  PreauthorizationSchema,
} from './entities/preauthorization.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [PreauthorizationsController],
  providers: [PreauthorizationsService],
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Preauthorization.name,
        schema: PreauthorizationSchema,
      },
    ]),
    UsersModule,
  ],
})
export class PreauthorizationsModule {}
