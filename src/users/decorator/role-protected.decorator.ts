import { SetMetadata } from '@nestjs/common';
import { Roles } from '../interfaces/rolesInterface';

//name of the key for arrays
// roles:['admin','employee','etc']
export const META_ROLES = 'roles';

//decorator to allow the guard to catch the roles
export const RoleProtected = (...args: Roles[]) => {
  return SetMetadata(META_ROLES, args);
};
