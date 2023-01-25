import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/users/decorator';
import { Roles, UserInformation } from '../../interfaces';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: Roles[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    //if roles are no specify the guard will let it pass
    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as UserInformation;

    //if user not exist the endpoint throw error
    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    //if valid roles include the role of user endpoint will be accesible
    if (validRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException('Invalid Role');
  }
}
