import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesProvider } from './files.provider';
import { FilesService } from './files.service';
import { CommonModule } from '../common/common.module';

@Module({
  providers: [FilesService, FilesProvider],
  imports: [ConfigModule, CommonModule],
  exports: [FilesService],
})
export class FilesModule {}
