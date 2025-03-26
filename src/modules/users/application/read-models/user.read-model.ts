import { User } from '../../../shared/types/TYPES';

export interface UserReadModel {
  id: string;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserListReadModel {
  users: UserReadModel[];
  total: number;
  page: number;
  limit: number;
}

export interface UserReadModelMapper {
  toReadModel(user: User): UserReadModel;
  toListReadModel(users: User[], total: number, page: number, limit: number): UserListReadModel;
} 