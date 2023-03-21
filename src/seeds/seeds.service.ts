import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SenioritiesService } from 'src/seniorities/seniorities.service';
import { superRoles } from 'src/users/interfaces/rolesInterface';
import { UsersService } from '../users/users.service';
import { HolidaysService } from '../holidays/holidays.service';
import { seniority_information, holidays_information } from './data';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class SeedsService {
  //get the data
  private readonly seniorityInformation = seniority_information;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly seniorityService: SenioritiesService,
    private readonly holidaysCatalogueSerivce: HolidaysService,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async executeSeeders(password: string) {
    //function to be sure that all constraints works before to insert that
    //for instanse: unique fields
    await this.connection.syncIndexes();
    const seed_password = this.configService.get<string>('SEED_PASSWORD');
    if (password !== seed_password) {
      throw new BadRequestException('incorrect password');
    }
    const adminInfo = await this.setAdminInfo();
    const seniorityInfo = await this.setSeniorityInfo();
    const holidaysInfo = await this.setHolidaysCatalogue();

    return {
      adminInfo,
      seniorityInfo,
      holidaysInfo,
    };
  }

  async setAdminInfo() {
    //get the info from env file
    const email = this.configService.get<string>('EMAIL');
    const role = superRoles.admin;

    //check if that data exists
    if (!email || !role) {
      return 'email and role must exist';
    }
    // check if data is already in DB
    const users = await this.usersService.findAllTM();
    console.log(users);
    if (users.length > 0) {
      return 'Data already exist, therefore seed can not be executed';
    }
    //insert data if info is not in db
    await this.usersService.create({ email, role });
    // return message en data
    return 'seed executed successfully';
  }

  async setSeniorityInfo() {
    //check if there is data
    if (this.seniorityInformation.length === 0) {
      return 'no data to load';
    }
    // check if data is already in DB
    const users = await this.seniorityService.findAll();
    if (users.length > 0) {
      return 'Data already exist, therefore seed can not be executed';
    }
    //insert data if info is not in db
    await this.seniorityService.create(this.seniorityInformation);
    //return information
    return 'seed executed successfully';
  }

  async setHolidaysCatalogue() {
    const holidaysCatalogue =
      await this.holidaysCatalogueSerivce.findAllCatalogue();
    if (holidaysCatalogue.length > 0) {
      return 'Data already exist, therefore seed can not be executed';
    }

    await this.holidaysCatalogueSerivce.fillCatalogue(holidays_information);
    return 'seed executed successfully';
  }
}
