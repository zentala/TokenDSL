import { Event, EventMetadata } from '../../../shared/types/TYPES';
import { UserEntity } from '../domain/user.entity';

export interface UserCreatedEventData {
  user: UserEntity;
}

export interface UserCreatedEvent extends Event {
  type: 'USER_CREATED';
  data: UserCreatedEventData;
  metadata: EventMetadata;
}

export interface UserCreatedEventHandler {
  handle(event: UserCreatedEvent): Promise<void>;
} 