import { EntityRepository, Repository } from 'typeorm';
import { TodoItem } from './todo-item.entity';
import { Todo } from '../todo/todo.entity';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { User } from 'src/user/user.entity';
@EntityRepository(TodoItem)
export class TodoItemRepository extends Repository<TodoItem> {
  async createTodoItem(
    todo: Todo,
    creator: User,
    createTodoItemDto: CreateTodoItemDto,
  ) {
    const { title } = createTodoItemDto;

    const todoItem = this.create({
      todo,
      title,
      creator,
    });

    await this.save(todoItem);
    delete todoItem.todo;
    delete todoItem.creator;
    return todoItem;
  }

  async getSingleTodoItem(todoItemId: string): Promise<TodoItem> {
    return await this.findOne(todoItemId, { relations: ['creator'] });
  }

  async updateTodoItem(todo: TodoItem, updates: Partial<TodoItem>) {
    const updated = {
      ...todo,
      ...updates,
    };

    await this.save(updated);
    return updated;
  }
}
