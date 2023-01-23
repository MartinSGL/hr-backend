import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [SeedsController],
  providers: [SeedsService],
  imports: [ConfigModule, UsersModule],
})
export class SeedModule {}
