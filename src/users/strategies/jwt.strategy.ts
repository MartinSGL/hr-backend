import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import * as mockData from '../mock-data/mock-users.json';
import { UserInformation, JwtPayload } from '../interfaces';

//PassportStrategy: return the token
//Strategy: validate the token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userService: Model<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<UserInformation> {
    const { users } = mockData;
    const user = users.find(({ email }) => email === payload.email);
    if (!user) throw new UnauthorizedException('Token not valid');

    //check if user is a TM (Talen Manager) user
    const tm_user = await this.userService.findOne({
      email: payload.email,
    });

    //make a new object without the password
    const infoUser = { ...user, password: undefined };

    //this info goes to req.user and it can be retrieved
    //in this case is retrieved with get-user decorator
    return {
      ...infoUser,
      role: tm_user ? tm_user.role : 'employee',
    };
  }
}
