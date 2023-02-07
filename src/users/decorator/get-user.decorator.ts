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

    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    //if they sent params decorator will return only data requestes if not all user info
    //example @GetUser('name') only retrieve the name
    //@GetUser() retrieve all the data
    return !data ? user : user[data];
  },
);
