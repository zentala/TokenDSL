import { Command, CommandMetadata } from '../../../shared/types/TYPES';
import { UserEntity } from '../../domain/user.entity';

export interface CreateUserCommandData {
  email: string;
  username: string;
  password: string;
  role?: string;
}

export interface CreateUserCommand extends Command {
  type: 'CREATE_USER';
  data: CreateUserCommandData;
  metadata: CommandMetadata;
}

export interface CreateUserCommandHandler {
  handle(command: CreateUserCommand): Promise<UserEntity>;
} 