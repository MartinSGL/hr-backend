import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserInformation } from '../interfaces/user.interface';

//decorator to retrive user information
export const GetUser = createParamDecorator(
  (data: UserInformation[keyof UserInformation], ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      console.log('check if route has decorator @Auth()');
      throw new InternalServerErrorException('User not found');
    }
    //if they sent params decorator will return only data requestes if not all user info
    //example @GetUser('name') only retrieve the name
    //@GetUser() retrieve all the data
    return !data ? user : user[data];
  },
);
