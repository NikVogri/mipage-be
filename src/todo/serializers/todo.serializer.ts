import {
  MinTodoOutput,
  parseTodoItemForMinOutput,
} from 'src/todo-item/serializers/todo-item.serializer';
import { Todo } from '../todo.entity';

export interface OutputTodo {
  id: string;
  title: string;
  color: string;
  pageId: string;
  items: MinTodoOutput[];
}

export const parseTodoForOutput = (todo: Todo): OutputTodo => {
  const output: OutputTodo = {
    color: todo.color,
    id: todo.id,
    pageId: todo.pageId,
    title: todo.title,
    items: undefined,
  };

  if (todo.items) {
    output.items = todo.items.map(parseTodoItemForMinOutput);
  }

  return output;
};
