import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SenioritiesService } from 'src/seniorities/seniorities.service';
import { superRoles, SuperRoles } from 'src/users/interfaces/rolesInterface';
import { UsersService } from '../users/users.service';
import { seniority_information } from './data/seniority-information';

@Injectable()
export class SeedsService {
  //get the data
  private readonly seniorityInformation = seniority_information;
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly seniorityService: SenioritiesService,
  ) {}
  async executeSeeders(password: string) {
    const seed_password = this.configService.get<string>('SEED_PASSWORD');
    if (password !== seed_password) {
      throw new BadRequestException('incorrect password');
    }
    const adminInfo = await this.setAdminInfo();
    const seniorityInfo = await this.setSeniorityInfo();

    return {
      adminInfo,
      seniorityInfo,
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
    const users = await this.usersService.findAll();
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
}
