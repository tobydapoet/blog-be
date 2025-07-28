import { Role } from '../enums/role.enum';

export type AuthJwtPayload = {
  id: string;
  sub: number;
  role: Role;
};
