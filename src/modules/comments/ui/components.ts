import { UiComponent, UiForm, UiFormField } from '../../../shared/types/TYPES';
import { CommentReadModel } from '../application/read-models/comment.read-model';

export interface CommentForm extends UiForm {
  fields: CommentFormField[];
}

export interface CommentFormField extends UiFormField {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  value?: string;
}

export interface CommentListComponent extends UiComponent {
  props: {
    comments: CommentReadModel[];
    onCommentClick: (commentId: string) => void;
    onCommentEdit: (commentId: string) => void;
    onCommentDelete: (commentId: string) => void;
    isLoading: boolean;
    error?: string;
  };
}

export interface CommentDetailComponent extends UiComponent {
  props: {
    comment: CommentReadModel;
    onUpdate: (data: Partial<CommentReadModel>) => void;
    onDelete: (commentId: string) => void;
    isLoading: boolean;
    error?: string;
  };
}
