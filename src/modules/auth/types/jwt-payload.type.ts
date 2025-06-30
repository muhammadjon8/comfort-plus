import { Role } from '#/shared/types/role.enum';

export type JwtPayload = {
  id: string;
  userEmail: string;
  role: Role;
};
