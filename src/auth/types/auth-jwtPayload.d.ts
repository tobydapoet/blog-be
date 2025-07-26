import { Role } from '../enums/role.enum';

export type AuthJwtPayload = {
  email: string;
  sub: number;
  role: Role;
};
