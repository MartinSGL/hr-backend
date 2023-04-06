import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonService } from './common.service';
import {
  TokenPreauthorization,
  TokenPreauthorizationSchema,
} from './entities/token-preauthorization.entity';

//this module has the features that works in more than one module
//example: paginationDto and generateFolio service
@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [
    ConfigModule,
    //this JWT generated is not to validates users
    //this is to encrypte the url of preauthorization
    //that's why is only last one hour
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_URL'),
          signOptions: {
            expiresIn: '1h',
          },
        };
      },
    }),
    MongooseModule.forFeature([
      {
        name: TokenPreauthorization.name,
        schema: TokenPreauthorizationSchema,
      },
    ]),
  ],
})
export class CommonModule {}
