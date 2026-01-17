export type UserRole = 'Employee' | 'IT_Staff' | 'Admin';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  department?: string;
  phone?: string;
}

export interface UpdateUserDto {
  fullName?: string;
  department?: string;
  phone?: string;
  role?: UserRole;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateStatusDto {
  status: UserStatus;
}
