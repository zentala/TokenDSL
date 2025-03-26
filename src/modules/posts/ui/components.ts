import { UiComponent, UiForm, UiFormField } from '../../../shared/types/TYPES';
import { PostReadModel } from '../application/read-models/post.read-model';

export interface PostForm extends UiForm {
  fields: PostFormField[];
}

export interface PostFormField extends UiFormField {
  name: keyof PostReadModel;
  type: 'text' | 'textarea' | 'select' | 'checkbox';
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => boolean;
  };
}

export interface PostListComponent extends UiComponent {
  props: {
    posts: PostReadModel[];
    onPostClick: (postId: string) => void;
    onPostEdit: (postId: string) => void;
    onPostDelete: (postId: string) => void;
    isLoading: boolean;
    error?: string;
  };
}

export interface PostDetailComponent extends UiComponent {
  props: {
    post: PostReadModel;
    onUpdate: (data: Partial<PostReadModel>) => void;
    onDelete: (postId: string) => void;
    isLoading: boolean;
    error?: string;
  };
}
