import { Roles } from './rolesInterface';

export interface UserInformation {
  id: string;
  name: string;
  email: string;
  role: Roles;
  date_admission: string;
}
