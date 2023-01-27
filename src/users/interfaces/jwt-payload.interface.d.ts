import { Roles } from './rolesInterface';

export interface JwtPayload {
  name: string;
  email: string;
  role: Roles;
}
