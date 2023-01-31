import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SenioritiesModule } from 'src/seniorities/seniorities.module';

@Module({
  controllers: [SeedsController],
  providers: [SeedsService],
  imports: [ConfigModule, UsersModule, SenioritiesModule],
})
export class SeedModule {}
