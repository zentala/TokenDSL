import { Query, QueryMetadata } from '../../../shared/types/TYPES';
import { UserEntity } from '../../domain/user.entity';

export interface GetUserQueryData {
  id: string;
}

export interface GetUserQuery extends Query {
  type: 'GET_USER';
  data: GetUserQueryData;
  metadata: QueryMetadata;
}

export interface GetUserQueryHandler {
  handle(query: GetUserQuery): Promise<UserEntity>;
} 