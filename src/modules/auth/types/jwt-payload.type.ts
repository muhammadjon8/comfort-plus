export type JwtPayload = {
  sub: string;
  userEmail: string;
  roles: 'admin' | 'user';
};
