import { Roles } from './rolesInterface';
import { UserAuth } from './user.interface';

interface LoginResponse {
  name: UserAuth['name'];
  role: Roles;
  token: string;
}
