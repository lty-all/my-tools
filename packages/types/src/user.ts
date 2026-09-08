export interface User {
  id: number;
  email: string;
  username?: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
