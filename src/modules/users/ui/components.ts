import { UiComponent, UiForm, UiFormField } from '../../../shared/types/TYPES';
import { UserReadModel } from '../application/read-models/user.read-model';

export interface UserForm extends UiForm {
  fields: UserFormField[];
}

export interface UserFormField extends UiFormField {
  name: keyof UserReadModel | 'password' | 'confirmPassword';
  type: 'text' | 'email' | 'password' | 'select' | 'checkbox';
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => boolean;
  };
}

export interface UserListComponent extends UiComponent {
  props: {
    users: UserReadModel[];
    onUserClick: (userId: string) => void;
    onUserEdit: (userId: string) => void;
    onUserDelete: (userId: string) => void;
    isLoading: boolean;
    error?: string;
  };
}

export interface UserProfileComponent extends UiComponent {
  props: {
    user: UserReadModel;
    onUpdate: (data: Partial<UserReadModel>) => void;
    onPasswordChange: (oldPassword: string, newPassword: string) => void;
    isLoading: boolean;
    error?: string;
  };
}
