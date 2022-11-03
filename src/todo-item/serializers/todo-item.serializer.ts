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
  return {
    id: todoItem.id,
    completed: todoItem.completed,
    title: todoItem.title,
    description: todoItem.description,
    todoId: todoItem.todoId,
    createdAt: todoItem.createdAt,
    completedAt: todoItem.completedAt,
    creator: {
      id: todoItem.creator?.id,
      username: todoItem.creator?.username,
      avatar: todoItem.creator?.avatar,
    },
  };
};
