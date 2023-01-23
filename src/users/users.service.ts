import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userService: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create<User>({
        ...createUserDto,
        id_tm: 1,
      });
      return user;
    } catch (error: any) {
      console.log(error);
      if (error.code === 11000) {
        throw new BadRequestException(
          `User email already exists ${JSON.stringify(error.keyValue)}`,
        );
      }
      throw new InternalServerErrorException('Server error, check logs');
    }
  }

  async findAll() {
    return this.userService.find();
  }
}
