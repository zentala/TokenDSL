import { UserEntity, UserRepository } from '../domain/user.entity';
import { DatabaseConfig } from '../../../shared/types/TYPES';

export interface UserRepositoryImpl extends UserRepository {
  constructor(config: DatabaseConfig);
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}

export interface UserRepositoryConfig extends DatabaseConfig {
  tableName: string;
  indexes: string[];
} 