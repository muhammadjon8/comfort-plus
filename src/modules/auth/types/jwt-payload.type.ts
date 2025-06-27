import { Role } from '#/shared/types/role.enum';

export type JwtPayload = {
  sub: string;
  userEmail: string;
  role: Role;
};
