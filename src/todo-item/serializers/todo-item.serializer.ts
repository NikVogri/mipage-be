import { TodoItem } from '../todo-item.entity';

export interface TodoItemOutput {
  id: string;
  completed: boolean;
  title: string;
  description?: string;
  todoId: string;
  createdAt: Date;
  completedAt: Date;
  creator: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export const parseTodoItemForOutput = (todoItem: TodoItem): TodoItemOutput => {
  const output: TodoItemOutput = {
    ...todoItem,
  };

  if (todoItem.creator) {
    output.creator = {
      id: todoItem.creator?.id,
      username: todoItem.creator?.username,
      avatar: todoItem.creator?.avatar,
    };
  }

  return output;
};
