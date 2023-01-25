import { Roles } from './rolesInterface';

export interface UserInformation {
  id: number;
  name: string;
  email: string;
  role: Roles;
  date_admission: string;
}
