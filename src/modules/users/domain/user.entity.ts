import { BaseEntity, User, UserRole } from '../../../shared/types/TYPES';

export interface UserEntity extends User {
  // Additional domain-specific user properties
  lastLoginAt?: number;
  failedLoginAttempts: number;
  isLocked: boolean;
  lockUntil?: number;
}

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  create(user: Omit<UserEntity, keyof BaseEntity>): Promise<UserEntity>;
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity>;
  delete(id: string): Promise<void>;
  list(limit?: number, offset?: number): Promise<UserEntity[]>;
}

export interface UserService {
  register(data: Omit<UserEntity, keyof BaseEntity>): Promise<UserEntity>;
  login(email: string, password: string): Promise<{ user: UserEntity; token: string }>;
  logout(userId: string): Promise<void>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updateProfile(userId: string, data: Partial<UserEntity>): Promise<UserEntity>;
  deactivateAccount(userId: string): Promise<void>;
  reactivateAccount(userId: string): Promise<void>;
} 