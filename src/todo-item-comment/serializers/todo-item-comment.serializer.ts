import { TodoItemComment } from '../todo-item-comment.entity';

export interface CreateTodoItemCommentOuput {
  body: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  todoItemId: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
}

export const parseCreateTodoItemCommentOutput = (
  todoItemComment: TodoItemComment,
): CreateTodoItemCommentOuput => {
  return {
    body: todoItemComment.body,
    id: todoItemComment.id,
    createdAt: todoItemComment.createdAt,
    updatedAt: todoItemComment.updatedAt,
    todoItemId: todoItemComment.todoItem?.id,
    author: {
      id: todoItemComment.author?.id,
      username: todoItemComment.author?.username,
      avatar: todoItemComment.author?.avatar,
    },
  };
};
