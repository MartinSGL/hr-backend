import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Roles } from 'src/users/users.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configServise: ConfigService,
  ) {}
  async setAdminInfo() {
    //get the info from env file
    const email = this.configServise.get<string>('EMAIL');
    const role = this.configServise.get<Roles>('ROLE');

    //validate that data exists
    if (!email || !role) {
      throw new BadRequestException('email and role must exist');
    }
    const users = await this.usersService.findAll();
    if (users.length > 0) {
      return 'Data already exist, therefore seed can not be executed';
    }
    const user = await this.usersService.create({ email, role });
    // return message en data
    return {
      meesage: 'SEED EXECUTED',
      data: user,
    };
  }
}
