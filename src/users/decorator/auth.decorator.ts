import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { Roles } from '../interfaces/rolesInterface';
import { RoleProtected } from './role-protected.decorator';

//decorator that involve another decorators and guards to make the code cleaner
//this decorator is used in controllers to protect routes
export function Auth(...roles: Roles[]) {
  return applyDecorators(
    RoleProtected(...roles), // specify the guard the roles
    UseGuards(AuthGuard(), UserRoleGuard), // guard wich specify roles authorized for a route (controller)
  );
}
