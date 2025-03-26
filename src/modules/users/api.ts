import { ApiResponse, ApiError } from '../../../shared/types/TYPES';
import { UserReadModel, UserListReadModel } from './application/read-models/user.read-model';
import { CreateUserCommandData } from './application/commands/create-user.command';

export interface UserApiEndpoints {
  // User Management
  createUser(data: CreateUserCommandData): Promise<ApiResponse<UserReadModel>>;
  getUser(id: string): Promise<ApiResponse<UserReadModel>>;
  updateUser(id: string, data: Partial<CreateUserCommandData>): Promise<ApiResponse<UserReadModel>>;
  deleteUser(id: string): Promise<ApiResponse<void>>;
  listUsers(page?: number, limit?: number): Promise<ApiResponse<UserListReadModel>>;

  // Authentication
  login(email: string, password: string): Promise<ApiResponse<{ user: UserReadModel; token: string }>>;
  logout(): Promise<ApiResponse<void>>;
  refreshToken(token: string): Promise<ApiResponse<{ token: string }>>;
  resetPassword(email: string): Promise<ApiResponse<void>>;
  changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>>;
}

export interface UserApiError extends ApiError {
  code: 'USER_NOT_FOUND' | 'USER_ALREADY_EXISTS' | 'INVALID_CREDENTIALS' | 'USER_LOCKED' | 'INVALID_TOKEN';
}
