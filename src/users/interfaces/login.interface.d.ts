import { Roles } from './rolesInterface';
import { UserAuth } from './user.interface';

interface UserLogin {
  name: UserAuth['name'];
  role: Roles;
}

export interface LoginResponse {
  user: UserLogin;
  token: string;
}
