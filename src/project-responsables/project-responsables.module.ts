import { Module } from '@nestjs/common';
import { ProjectResponsablesService } from './project-responsables.service';
import { ProjectResponsablesController } from './project-responsables.controller';
import { CommonModule } from 'src/common/common.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectResponsable,
  ProjectResponsableSchema,
} from './entities/project-responsable.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProjectResponsablesController],
  providers: [ProjectResponsablesService],
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      {
        name: ProjectResponsable.name,
        schema: ProjectResponsableSchema,
      },
    ]),
    UsersModule,
  ],
  exports: [ProjectResponsablesService],
})
export class ProjectResponsablesModule {}
