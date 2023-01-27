import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import * as mockData from './mock-data/mock-users.json';
import { LoginResponse, JwtPayload } from './interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userService: Model<User>,
    //this service is provided by the "JwtModule" which has the config of jwt token
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    //make sure email letters are lowercase
    createUserDto.email = createUserDto.email.toLowerCase();
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

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { users } = mockData;
    loginUserDto.email = loginUserDto.email.toLowerCase();
    const user = users.find(({ email }) => email === loginUserDto.email);

    //check if email is correct
    if (!user) throw new UnauthorizedException('Invalid credentials');
    //check if password is correct
    if (user.password !== loginUserDto.password)
      throw new UnauthorizedException('Invalid credentials');

    //check if user is a TM (Talen Manager) user
    const tm_user = await this.userService.findOne({
      email: loginUserDto.email,
    });

    return {
      token: this.getJwtToken({
        name: user.name,
        email: user.email,
        role: tm_user ? tm_user.role : 'employee',
      }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
